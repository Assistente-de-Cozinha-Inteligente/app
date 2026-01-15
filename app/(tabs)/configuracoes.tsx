import { ModalSelecao } from '@/components/modal-selecao';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { SectionUI } from '@/components/ui/section';
import { TextUI } from '@/components/ui/text';
import { Toggle } from '@/components/ui/toggle';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

// Variável de controle de login
const logado = true; // Altere para false para ver a versão não logada

// Opções para cada tipo de recomendação
const recomendacoesOptions = {
  restricaoAlimentar: ['Nenhuma', 'Vegetariano', 'Vegano', 'Sem glúten', 'Sem lactose'],
  alergias: ['Nenhuma', 'Lactose', 'Glúten', 'Amendoim', 'Frutos do mar', 'Ovos', 'Soja'],
  prioridade: ['Rapidez', 'Economia', 'Saúde', 'Sabor'],
  preferenciaReceita: ['Balanciada', 'Proteínas', 'Carboidratos', 'Vegetais', 'Sobremesas'],
  nivelCozinha: ['Iniciante', 'Intermediário', 'Avançado'],
};

export default function ConfiguracoesScreen() {
  const [dailySuggestions, setDailySuggestions] = useState(true);
  
  // Estados para valores selecionados
  const [restricaoAlimentar, setRestricaoAlimentar] = useState('Vegetariano');
  const [alergias, setAlergias] = useState<string[]>(['Lactose', 'Glúten']);
  const [prioridade, setPrioridade] = useState('Rapidez');
  const [preferenciaReceita, setPreferenciaReceita] = useState('Balanciada');
  const [nivelCozinha, setNivelCozinha] = useState('Iniciante');
  
  // Estados para controlar qual modal está aberto
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalOptions, setModalOptions] = useState<string[]>([]);
  const [modalSelectedValue, setModalSelectedValue] = useState<string | string[]>('');
  const [modalOnSelect, setModalOnSelect] = useState<(value: string | string[]) => void>(() => {});
  const [modalMultiple, setModalMultiple] = useState(false);

  const formatAlergias = (alergiasArray: string[]): string => {
    if (alergiasArray.length === 0) return 'Nenhuma';
    if (alergiasArray.length <= 2) return alergiasArray.join(', ');
    return `${alergiasArray.slice(0, 2).join(', ')}...`;
  };

  const openModal = (
    title: string,
    options: string[],
    selectedValue: string | string[],
    onSelect: (value: string | string[]) => void,
    multiple: boolean = false
  ) => {
    setModalTitle(title);
    setModalOptions(options);
    setModalSelectedValue(selectedValue);
    setModalOnSelect(() => onSelect);
    setModalMultiple(multiple);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ViewContainerUI>
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

      <ScrollViewWithPadding>
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
            <Pressable style={styles.profileCard}>
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
              openModal(
                'Restrição alimentar',
                recomendacoesOptions.restricaoAlimentar,
                restricaoAlimentar,
                (value) => setRestricaoAlimentar(value as string)
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
                {restricaoAlimentar}
              </TextUI>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
            </View>
          </Pressable>

          <Pressable
            style={styles.recommendationItem}
            onPress={() =>
              openModal(
                'Alergias',
                recomendacoesOptions.alergias,
                alergias,
                (value) => setAlergias(value as string[]),
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
              openModal(
                'Prioridade',
                recomendacoesOptions.prioridade,
                prioridade,
                (value) => setPrioridade(value as string)
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
              openModal(
                'Preferência de receita',
                recomendacoesOptions.preferenciaReceita,
                preferenciaReceita,
                (value) => setPreferenciaReceita(value as string)
              )
            }
          >
            <View style={styles.recommendationLeft}>
              <Ionicons name="moon-outline" size={20} color={Colors.light.mainText} />
              <TextUI variant="regular" style={styles.recommendationText}>
                Preferência de receita
              </TextUI>
            </View>
            <View style={styles.recommendationRight}>
              <TextUI variant="regular" style={styles.recommendationValue}>
                {preferenciaReceita}
              </TextUI>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
            </View>
          </Pressable>

          <Pressable
            style={styles.recommendationItem}
            onPress={() =>
              openModal(
                'Nível na cozinha',
                recomendacoesOptions.nivelCozinha,
                nivelCozinha,
                (value) => setNivelCozinha(value as string)
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
              onValueChange={setDailySuggestions}
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
          <Pressable style={styles.supportItem}>
            <TextUI variant="regular" style={styles.supportText}>
              Política de Privacidade
            </TextUI>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
          </Pressable>

          <Pressable style={styles.supportItem}>
            <TextUI variant="regular" style={styles.supportText}>
              Termos de Uso
            </TextUI>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
          </Pressable>

          <Pressable style={styles.supportItem}>
            <TextUI variant="regular" style={styles.supportText}>
              Fale Conosco
            </TextUI>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
          </Pressable>
        </SectionUI>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Seção Acesso */}
        <SectionUI
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
        </SectionUI>
      </ScrollViewWithPadding>

      {/* Modal de Seleção */}
      <ModalSelecao
        visible={modalVisible}
        onClose={closeModal}
        title={modalTitle}
        options={modalOptions}
        selectedValue={modalSelectedValue}
        onSelect={modalOnSelect}
        multiple={modalMultiple}
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
