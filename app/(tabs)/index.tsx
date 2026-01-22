import { CardPreferenciasIA } from '@/components/card-preferencias-ia';
import { CronometroOferta } from '@/components/cronometro-oferta';
import { EmptyCozinhaCard } from '@/components/empty-cozinha-card';
import { ReceitaSlider } from '@/components/receita-slider';
import { ReceitaSliderFazer, ReceitaSliderFazerRef } from '@/components/receita-slider-fazer';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { SectionUI } from '@/components/ui/section';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { getInventario } from '@/data/local/dao/inventarioDao';
import { buscarReceitasHomePaginacao, buscarTop3ReceitasPossiveis, ReceitaComScore } from '@/data/local/dao/receitaDao';
import { getOrCreateLocalUser } from '@/data/local/dao/usuarioDao';
import { Usuario } from '@/models';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

export default function HomeScreen() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [showCronometro, setShowCronometro] = useState(false);
  const [showPreferenciasIA, setShowPreferenciasIA] = useState(false);
  const [hasIngredientes, setHasIngredientes] = useState(true);
  const [receitasFazer, setReceitasFazer] = useState<ReceitaComScore[]>([]);
  const receitaSliderRef = useRef<ReceitaSliderFazerRef>(null);
  const [receitas, setReceitas] = useState<ReceitaComScore[]>([]);
  const [paginaReceitas, setPaginaReceitas] = useState(0);

  // Verifica se o usuário tem menos de 23 horas desde a criação E se ganhou a oferta
  const checkShouldShowCronometro = async (usuario: Usuario | null) => {
    if (!usuario || !usuario.criado_em) {
      return false;
    }

    // Verifica se ganhou a oferta no storage
    const ganhouOferta = await AsyncStorage.getItem('ganhou_oferta');
    if (ganhouOferta !== '1') {
      return false;
    }

    const agora = Date.now();
    const tempoDecorrido = agora - usuario.criado_em;
    const vinteTresHoras = 23 * 60 * 60 * 1000; // 23 horas em milissegundos

    return tempoDecorrido < vinteTresHoras;
  };

  useFocusEffect(() => {
    setShowCronometro(false);

    // Volta o slider de receitas para o primeiro índice
    receitaSliderRef.current?.scrollToStart();

    getOrCreateLocalUser().then(async (user) => {
      if (user) {
        setUsuario(user);
        const shouldShow = await checkShouldShowCronometro(user);
        setShowCronometro(shouldShow);
      }
    });

    // Verifica se o usuário tem ingredientes
    getInventario().then((inventario) => {
      setHasIngredientes(inventario.length > 0);
    });
  });

  const buscarReceitasFazer = async () => {
    const receitas = await buscarTop3ReceitasPossiveis();

    console.log("A FAZER: ", receitas);
    setReceitasFazer(receitas);
    return receitas;
  };

  const buscarReceitas = async (pagina: number, excluirIds: number[] = []) => {
    const receitasPaginacao = await buscarReceitasHomePaginacao(pagina, 2, excluirIds);
    
    // Só adiciona se houver receitas novas e que não estejam duplicadas
    if (receitasPaginacao.length > 0) {
      setReceitas(prev => {
        const idsExistentes = new Set(prev.map(r => r.id));
        const receitasNovas = receitasPaginacao.filter(r => !idsExistentes.has(r.id));
        return [...prev, ...receitasNovas];
      });
    }
  };

  useEffect(() => {
    if (!usuario) return;

    // Reseta os estados
    setReceitasFazer([]);
    setReceitas([]);
    setPaginaReceitas(0);

    const carregarReceitas = async () => {
      // Primeiro busca as receitas para fazer
      const receitasParaFazer = await buscarReceitasFazer();
      
      // Depois busca outras receitas, excluindo as que já estão em "para fazer"
      const idsParaExcluir = receitasParaFazer.map(r => r.id);
      await buscarReceitas(0, idsParaExcluir);
    };

    carregarReceitas();
  }, [usuario]);

  // Determina o título da seção baseado na quantidade de ingredientes faltantes
  const getTituloSugestao = (): string => {
    if (receitasFazer.length === 0) {
      return "Sugestão";
    }

    const primeiraReceita = receitasFazer[0];
    const qtdFaltantes = primeiraReceita.qtd_faltantes;

    // Nenhum ingrediente faltando
    if (qtdFaltantes === 0) {
      return "Perfeito para você";
    }

    // Faltando menos que 3 ingredientes (1 ou 2)
    if (qtdFaltantes < 3) {
      return "Precisa de um ajuste";
    }

    // Exatamente 3 ingredientes faltando
    if (qtdFaltantes === 3) {
      return "Talvez você possa fazer";
    }

    // Faltando mais que 3 até 4 ingredientes
    if (qtdFaltantes > 3 && qtdFaltantes <= 4) {
      return "Quase tudo em casa";
    }

    // ELSE (mais de 4 ingredientes faltando)
    return "Sugestão";
  };

  return (
    <ViewContainerUI isTabBar={true} exibirIA={true}>
      <PageHeader
        style={{
          marginBottom: 15,
          paddingHorizontal: 20,
        }}
        title="Olá, bem vindo"
        description="Tenho algumas receitas para hoje"
        rightComponent={
          <Ionicons name="notifications-outline" size={26} color="black" />
        }
      />
      <ScrollViewWithPadding
        keyboardShouldPersistTaps="handled"
      >
        {/* Card para quando não tem ingredientes */}
        {!hasIngredientes && (
          <SectionUI title="" style={{
            paddingHorizontal: 20,
          }}>
            <EmptyCozinhaCard onAddIngredients={() => router.push('/adicionar-item-inventario?from=index')} />
          </SectionUI>
        )}

        {showCronometro && usuario?.criado_em && (
          <SectionUI title="" style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}>
            <CronometroOferta variant="compact" criadoEm={usuario.criado_em} />
          </SectionUI>
        )}

        {showPreferenciasIA && <SectionUI title="" style={{
          paddingHorizontal: 20,
        }}>
          <CardPreferenciasIA
            preferencias={[
              { id: '1', text: 'Você costuma preferir receitas rápidas.', icon: 'flash-outline' },
              { id: '2', text: 'Você evita receitas com muitos passos.', icon: 'remove-circle-outline' },
              { id: '3', text: 'Você usa frango com frequência.', icon: 'restaurant-outline' },
            ]}
          />
        </SectionUI>}

        {receitasFazer.length > 0 && <SectionUI title={getTituloSugestao()} style={{
          paddingHorizontal: 20,
        }}>
          <ReceitaSliderFazer ref={receitaSliderRef} receitas={receitasFazer} />
        </SectionUI>}

        <SectionUI title="Outras ideias simples" titleStyle={{
          paddingHorizontal: 20,
        }}>
          <ReceitaSlider receitas={receitas} onEndReached={() => {
            const pagina = paginaReceitas + 1;
            // Exclui tanto as receitas "para fazer" quanto as que já foram adicionadas
            const idsParaExcluir = [
              ...receitasFazer.map(r => r.id),
              ...receitas.map(r => r.id)
            ];
            buscarReceitas(pagina, idsParaExcluir);
            setPaginaReceitas(pagina);
          }} />
        </SectionUI>

        <SectionUI title="" style={{
          paddingHorizontal: 20,
        }}>
          <View style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#EBEBEB',
            paddingHorizontal: 18,
            paddingVertical: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TextUI variant="medium">
              🧺 {" "} 2 itens perto de vencer
            </TextUI>
            <Pressable onPress={() => console.log('Ver todos')}>
              <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.primary} />
            </Pressable>
          </View>
        </SectionUI>

      </ScrollViewWithPadding>
    </ViewContainerUI>
  );
} 
