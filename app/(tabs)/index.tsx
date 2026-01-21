import { CardPreferenciasIA } from '@/components/card-preferencias-ia';
import { CronometroOferta } from '@/components/cronometro-oferta';
import { EmptyCozinhaCard } from '@/components/empty-cozinha-card';
import { ReceitaSlider } from '@/components/receita-slider';
import { ReceitaSliderFazer } from '@/components/receita-slider-fazer';
import { ButtonUI } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { SectionUI } from '@/components/ui/section';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { getInventario } from '@/data/local/dao/inventarioDao';
import { getOrCreateLocalUser } from '@/data/local/dao/usuarioDao';
import { Usuario } from '@/models';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

export default function HomeScreen() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [showCronometro, setShowCronometro] = useState(false);
  const [showPreferenciasIA, setShowPreferenciasIA] = useState(false);
  const [hasIngredientes, setHasIngredientes] = useState(true);

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

    getOrCreateLocalUser().then(async (user) => {
      if (user) {
        setUsuario(user);
        const shouldShow = await checkShouldShowCronometro(user);
        setShowCronometro(shouldShow);
      }
      console.log(user, "(<<<<<<<<< ID do usuário <<<<<<<<<)");
    });

    // Verifica se o usuário tem ingredientes
    getInventario().then((inventario) => {
      setHasIngredientes(inventario.length > 0);
    });
  });

  const receitasFazer = [
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      title: "Frango com legumes",
      time: "20 min",
      servings: "1 pessoa",
      description: "Usa ingredientes comuns",
      onFazerAgora: () => console.log('Fazer agora 1'),
      onProxima: () => console.log('Próxima 1'),
    },
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      title: "Salmão grelhado",
      time: "25 min",
      servings: "2 pessoas",
      description: "Receita rápida e saudável",
      onFazerAgora: () => console.log('Fazer agora 2'),
      onProxima: () => console.log('Próxima 2'),
    },
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      title: "Massa com molho",
      time: "15 min",
      servings: "1 pessoa",
      description: "Perfeito para o almoço",
      onFazerAgora: () => console.log('Fazer agora 3'),
      onProxima: () => console.log('Próxima 3'),
    },
  ];

  const receitas = [
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      category: "Sushi",
      title: "Sushi",
      time: "35 min",
      servings: "2 pessoas",
      difficulty: "Fácil",
      onPress: () => router.push('/receita/1'),
    },
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      category: "Sushi",
      title: "Sushi",
      time: "35 min",
      servings: "2 pessoas",
      difficulty: "Fácil",
      onPress: () => router.push('/receita/1'),
    },
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      category: "Sushi",
      title: "Sushi",
      time: "35 min",
      servings: "2 pessoas",
      difficulty: "Fácil",
      onPress: () => router.push('/receita/1'),
    },
  ];


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

        <SectionUI title="Sugestão rápida" style={{
          paddingHorizontal: 20,
        }}>
          <ReceitaSliderFazer receitas={receitasFazer} />
        </SectionUI>

        <SectionUI title="Outras ideias simples" titleStyle={{
          paddingHorizontal: 20,
        }}>
          <ReceitaSlider receitas={receitas} />
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
