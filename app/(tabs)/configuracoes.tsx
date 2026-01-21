import { BottomSheetSelecao } from '@/components/bottom-sheet-selecao';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { SectionUI } from '@/components/ui/section';
import { TextUI } from '@/components/ui/text';
import { Toggle } from '@/components/ui/toggle';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { atualizarAlergias, atualizarPerfilUsuario, atualizarPrioridades, atualizarRestricoesAlimentares, getPerfilCompleto } from '@/data/local/dao/perfilUsuarioDao';
import { Alergia, RestricaoAlimentar } from '@/models';
import { getRecomendacoesOptions, mapDBtoUI, mapUItoDB } from '@/utils/perfilOptions';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, Image, Linking, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

// Variável de controle de login
const logado = false; // Altere para false para ver a versão não logada

export default function ConfiguracoesScreen() {
  const [dailySuggestions, setDailySuggestions] = useState(true);
  const [perfilId, setPerfilId] = useState<number | null>(null);

  // Opções baseadas no schema do banco
  const recomendacoesOptions = useMemo(() => getRecomendacoesOptions(), []);

  // Estados para valores selecionados (valores da UI)
  const [restricaoAlimentar, setRestricaoAlimentar] = useState<string[]>([]);
  const [alergias, setAlergias] = useState<string[]>([]);
  const [prioridade, setPrioridade] = useState<string>('Rapidez');
  const [nivelCozinha, setNivelCozinha] = useState<string>('Iniciante');

  // Estados para controlar qual bottom sheet está aberto
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetTitle, setBottomSheetTitle] = useState('');
  const [bottomSheetOptions, setBottomSheetOptions] = useState<string[]>([]);
  const [bottomSheetSelectedValue, setBottomSheetSelectedValue] = useState<string | string[]>('');
  const [bottomSheetOnSelect, setBottomSheetOnSelect] = useState<(value: string | string[]) => void>(() => { });
  const [bottomSheetMultiple, setBottomSheetMultiple] = useState(false);

  // Handler para o botão de voltar do Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Se o bottom sheet estiver aberto, fecha ele primeiro
      if (bottomSheetVisible) {
        closeBottomSheet();
        return true; // Previne o comportamento padrão (voltar para tela anterior)
      }
      return false; // Permite o comportamento padrão
    });

    return () => backHandler.remove();
  }, [bottomSheetVisible]);

  // Carrega dados do banco
  useFocusEffect(
    useCallback(() => {
      const loadPerfil = async () => {
        try {
          const perfilCompleto = await getPerfilCompleto();
          if (perfilCompleto) {
            setPerfilId(perfilCompleto.perfil.id);
            setDailySuggestions(perfilCompleto.perfil.receber_sugestao_dia);
            setNivelCozinha(mapDBtoUI.nivelCozinha(perfilCompleto.perfil.nivel_cozinha));

            // Mapeia restrições DB -> UI
            const restricoesUI = perfilCompleto.restricoes
              .map(r => mapDBtoUI.restricaoAlimentar(r))
              .filter(r => r !== 'Nenhuma');
            setRestricaoAlimentar(restricoesUI.length > 0 ? restricoesUI : ['Nenhuma']);

            // Mapeia alergias DB -> UI
            const alergiasUI = perfilCompleto.alergias
              .map(a => mapDBtoUI.alergia(a))
              .filter(a => a !== 'Nenhuma');
            setAlergias(alergiasUI.length > 0 ? alergiasUI : ['Nenhuma']);

            // Mapeia prioridades DB -> UI (pega a primeira)
            if (perfilCompleto.prioridades.length > 0) {
              setPrioridade(mapDBtoUI.prioridade(perfilCompleto.prioridades[0]));
            }
          }
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
        }
      };
      loadPerfil();
    }, [])
  );

  const formatAlergias = (alergiasArray: string[]): string => {
    const filtered = alergiasArray.filter(a => a !== 'Nenhuma');
    if (filtered.length === 0) return 'Nenhuma';

    const MAX_LENGTH = 25; // Limite de caracteres
    const text = filtered.join(', ');

    if (text.length <= MAX_LENGTH) return text;

    // Tenta mostrar pelo menos 2 itens
    if (filtered.length <= 2) {
      return `${text.substring(0, MAX_LENGTH - 3)}...`;
    }

    // Mostra os primeiros itens que cabem no limite
    let result = '';
    for (let i = 0; i < filtered.length; i++) {
      const nextItem = i === 0 ? filtered[i] : `, ${filtered[i]}`;
      if ((result + nextItem).length <= MAX_LENGTH - 3) {
        result += nextItem;
      } else {
        break;
      }
    }
    return `${result}...`;
  };

  const formatRestricoes = (restricoesArray: string[]): string => {
    const filtered = restricoesArray.filter(r => r !== 'Nenhuma');
    if (filtered.length === 0) return 'Nenhuma';

    const MAX_LENGTH = 25; // Limite de caracteres
    const text = filtered.join(', ');

    if (text.length <= MAX_LENGTH) return text;

    // Tenta mostrar pelo menos 2 itens
    if (filtered.length <= 2) {
      return `${text.substring(0, MAX_LENGTH - 3)}...`;
    }

    // Mostra os primeiros itens que cabem no limite
    let result = '';
    for (let i = 0; i < filtered.length; i++) {
      const nextItem = i === 0 ? filtered[i] : `, ${filtered[i]}`;
      if ((result + nextItem).length <= MAX_LENGTH - 3) {
        result += nextItem;
      } else {
        break;
      }
    }
    return `${result}...`;
  };

  const openBottomSheet = (
    title: string,
    options: string[],
    selectedValue: string | string[],
    onSelect: (value: string | string[]) => void,
    multiple: boolean = false
  ) => {
    setBottomSheetTitle(title);
    setBottomSheetOptions(options);
    setBottomSheetSelectedValue(selectedValue);
    setBottomSheetOnSelect(() => onSelect);
    setBottomSheetMultiple(multiple);
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  const handleRestricaoAlimentarSelect = async (value: string | string[]) => {
    const values = Array.isArray(value) ? value : [value];
    const filtered = values.filter(v => v !== 'Nenhuma');
    setRestricaoAlimentar(filtered.length > 0 ? filtered : ['Nenhuma']);

    if (perfilId) {
      try {
        const restricoesDB = filtered
          .map(r => mapUItoDB.restricaoAlimentar(r))
          .filter((r): r is RestricaoAlimentar => r !== null);
        await atualizarRestricoesAlimentares(perfilId, restricoesDB);
      } catch (error) {
        console.error('Erro ao salvar restrições:', error);
      }
    }
  };

  const handleAlergiasSelect = async (value: string | string[]) => {
    const values = Array.isArray(value) ? value : [value];
    const filtered = values.filter(v => v !== 'Nenhuma');
    setAlergias(filtered.length > 0 ? filtered : ['Nenhuma']);

    if (perfilId) {
      try {
        const alergiasDB = filtered
          .map(a => mapUItoDB.alergia(a))
          .filter((a): a is Alergia => a !== null);
        await atualizarAlergias(perfilId, alergiasDB);
      } catch (error) {
        console.error('Erro ao salvar alergias:', error);
      }
    }
  };

  const handlePrioridadeSelect = async (value: string | string[]) => {
    const prioridadeValue = Array.isArray(value) ? value[0] : value;
    setPrioridade(prioridadeValue);

    if (perfilId) {
      try {
        const prioridadeDB = mapUItoDB.prioridade(prioridadeValue);
        if (prioridadeDB) {
          await atualizarPrioridades(perfilId, [prioridadeDB]);
        }
      } catch (error) {
        console.error('Erro ao salvar prioridade:', error);
      }
    }
  };

  const handleNivelCozinhaSelect = async (value: string | string[]) => {
    const nivelValue = Array.isArray(value) ? value[0] : value;
    setNivelCozinha(nivelValue);

    if (perfilId) {
      try {
        const nivelDB = mapUItoDB.nivelCozinha(nivelValue);
        await atualizarPerfilUsuario(nivelDB, dailySuggestions);
      } catch (error) {
        console.error('Erro ao salvar nível de cozinha:', error);
      }
    }
  };

  const handleDailySuggestionsChange = async (value: boolean) => {
    setDailySuggestions(value);

    if (perfilId) {
      try {
        const nivelDB = mapUItoDB.nivelCozinha(nivelCozinha);
        await atualizarPerfilUsuario(nivelDB, value);
      } catch (error) {
        console.error('Erro ao salvar sugestões diárias:', error);
      }
    }
  };

  const handleOpenURL = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o link');
      }
    } catch (error) {
      console.error('Erro ao abrir URL:', error);
      Alert.alert('Erro', 'Não foi possível abrir o link');
    }
  };

  const handleOpenEmail = async (email: string) => {
    try {
      const emailUrl = `mailto:${email}`;
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o cliente de email');
      }
    } catch (error) {
      console.error('Erro ao abrir email:', error);
      Alert.alert('Erro', 'Não foi possível abrir o cliente de email');
    }
  };

  return (
    <ViewContainerUI isTabBar={true} exibirIA={true}>
      <ScrollViewWithPadding>
        <PageHeader
          style={{
            paddingHorizontal: 20,
          }}
          title="Meu Perfil"
          description="Ajustes para recomendações melhores"
          rightComponent={
            <TouchableOpacity activeOpacity={0.7}>
              <View style={styles.notificationContainer}>
                <Ionicons name="notifications-outline" size={26} color={Colors.light.mainText} />
                <View style={styles.notificationDot} />
              </View>
            </TouchableOpacity>
          }
        />

        {/* Seção Meu Perfil */}
        <SectionUI
          title=""
          style={{
            paddingHorizontal: 20,
          }}
        >
          {logado ? (
            <Pressable
              style={styles.profileCard}
              onPress={() => router.push('/editar-perfil')}
            >
              <View style={styles.profileLeft}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                    style={styles.avatar}
                  />
                </View>
                <View style={styles.profileInfo}>
                  <TextUI variant="semibold" style={styles.profileName}>
                    Guilherme
                  </TextUI>
                  <View style={styles.badgeContainer}>
                    <TextUI variant="regular" style={styles.badgeText}>
                      Plano Gratuito
                    </TextUI>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
            </Pressable>
          ) : (
            <Pressable
              style={styles.profileCard}
              onPress={() => router.push('/login')}
            >
              <View style={styles.profileLeft}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="person-outline" size={32} color={Colors.light.bodyText} />
                </View>
                <View style={styles.profileInfo}>
                  <TextUI variant="semibold" style={styles.profileName}>
                    Faça login
                  </TextUI>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
            </Pressable>
          )}
        </SectionUI>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Seção Recomendações */}
        <SectionUI
          title="Recomendações"
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Pressable
            style={styles.recommendationItem}
            onPress={() =>
              openBottomSheet(
                'Restrição alimentar',
                recomendacoesOptions.restricaoAlimentar,
                restricaoAlimentar,
                handleRestricaoAlimentarSelect,
                true // múltipla seleção
              )
            }
          >
            <View style={styles.recommendationLeft}>
              <Ionicons name="moon-outline" size={20} color={Colors.light.mainText} />
              <TextUI variant="regular" style={styles.recommendationText}>
                Restrição alimentar
              </TextUI>
            </View>
            <View style={styles.recommendationRight}>
              <TextUI variant="regular" style={styles.recommendationValue}>
                {formatRestricoes(restricaoAlimentar)}
              </TextUI>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
            </View>
          </Pressable>

          <Pressable
            style={styles.recommendationItem}
            onPress={() =>
              openBottomSheet(
                'Alergias',
                recomendacoesOptions.alergias,
                alergias,
                handleAlergiasSelect,
                true // múltipla seleção
              )
            }
          >
            <View style={styles.recommendationLeft}>
              <Ionicons name="moon-outline" size={20} color={Colors.light.mainText} />
              <TextUI variant="regular" style={styles.recommendationText}>
                Alergias
              </TextUI>
            </View>
            <View style={styles.recommendationRight}>
              <TextUI variant="regular" style={styles.recommendationValue}>
                {formatAlergias(alergias)}
              </TextUI>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
            </View>
          </Pressable>

          <Pressable
            style={styles.recommendationItem}
            onPress={() =>
              openBottomSheet(
                'Prioridade',
                recomendacoesOptions.prioridade,
                prioridade,
                handlePrioridadeSelect
              )
            }
          >
            <View style={styles.recommendationLeft}>
              <Ionicons name="moon-outline" size={20} color={Colors.light.mainText} />
              <TextUI variant="regular" style={styles.recommendationText}>
                Prioridade
              </TextUI>
            </View>
            <View style={styles.recommendationRight}>
              <TextUI variant="regular" style={styles.recommendationValue}>
                {prioridade}
              </TextUI>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
            </View>
          </Pressable>

          <Pressable
            style={styles.recommendationItem}
            onPress={() =>
              openBottomSheet(
                'Nível na cozinha',
                recomendacoesOptions.nivelCozinha,
                nivelCozinha,
                handleNivelCozinhaSelect
              )
            }
          >
            <View style={styles.recommendationLeft}>
              <Ionicons name="moon-outline" size={20} color={Colors.light.mainText} />
              <TextUI variant="regular" style={styles.recommendationText}>
                Nível na cozinha
              </TextUI>
            </View>
            <View style={styles.recommendationRight}>
              <TextUI variant="regular" style={styles.recommendationValue}>
                {nivelCozinha}
              </TextUI>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
            </View>
          </Pressable>
        </SectionUI>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Seção Notificações */}
        <SectionUI
          title="Notificações"
          style={{
            paddingHorizontal: 20,
          }}
        >
          <View style={styles.notificationItem}>
            <TextUI variant="regular" style={styles.notificationText}>
              Receber sugestões do dia
            </TextUI>
            <Toggle
              value={dailySuggestions}
              onValueChange={handleDailySuggestionsChange}
            />
          </View>
        </SectionUI>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Seção Suporte */}
        <SectionUI
          title="Suporte"
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Pressable 
            style={styles.supportItem}
            onPress={() => handleOpenURL('https://example.com/')}
          >
            <TextUI variant="regular" style={styles.supportText}>
              Política de Privacidade
            </TextUI>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
          </Pressable>

          <Pressable 
            style={styles.supportItem}
            onPress={() => handleOpenURL('https://example.com/')}
          >
            <TextUI variant="regular" style={styles.supportText}>
              Termos de Uso
            </TextUI>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
          </Pressable>

          <Pressable 
            style={styles.supportItem}
            onPress={() => handleOpenEmail('guilherme.araujo1535@gmail.com')}
          >
            <TextUI variant="regular" style={styles.supportText}>
              Fale Conosco
            </TextUI>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
          </Pressable>
        </SectionUI>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Seção Acesso */}
        {logado && <SectionUI
          title="Acesso"
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Pressable style={styles.accessItem}>
            <TextUI variant="regular" style={styles.accessText}>
              Excluir conta
            </TextUI>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
          </Pressable>

          <Pressable style={styles.accessItem}>
            <TextUI variant="regular" style={styles.logoutText}>
              Logout
            </TextUI>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.danger} />
          </Pressable>
        </SectionUI>}
      </ScrollViewWithPadding>

      {/* Bottom Sheet de Seleção */}
      <BottomSheetSelecao
        visible={bottomSheetVisible}
        onClose={closeBottomSheet}
        title={bottomSheetTitle}
        options={bottomSheetOptions}
        selectedValue={bottomSheetSelectedValue}
        onSelect={bottomSheetOnSelect}
        multiple={bottomSheetMultiple}
        showConfirmButton={bottomSheetTitle === 'Prioridade' || bottomSheetTitle === 'Nível na cozinha'}
      />
    </ViewContainerUI>
  );
}

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.input,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileInfo: {
    flex: 1,
    gap: 8,
  },
  profileName: {
    fontSize: 16,
    color: Colors.light.mainText,
  },
  badgeContainer: {
    backgroundColor: '#010F07',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    color: Colors.light.white,
  },
  divider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  recommendationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  recommendationText: {
    fontSize: 14,
    color: Colors.light.mainText,
  },
  recommendationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recommendationValue: {
    fontSize: 14,
    color: Colors.light.bodyText,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  notificationText: {
    fontSize: 14,
    color: Colors.light.mainText,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  supportText: {
    fontSize: 14,
    color: Colors.light.mainText,
  },
  accessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  accessText: {
    fontSize: 14,
    color: Colors.light.mainText,
  },
  logoutText: {
    fontSize: 14,
    color: Colors.light.danger,
  },
});
