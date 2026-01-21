import { BottomSheetSelecao } from '@/components/bottom-sheet-selecao';
import { ConfigItem } from '@/components/config-item';
import { ProfileCard } from '@/components/profile-card';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { SectionUI } from '@/components/ui/section';
import { TextUI } from '@/components/ui/text';
import { Toggle } from '@/components/ui/toggle';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { useBottomSheetSelecao } from '@/hooks/use-bottom-sheet-selecao';
import { usePerfilConfig } from '@/hooks/use-perfil-config';
import { formatListForDisplay } from '@/utils/formatText';
import { openEmail, openURL } from '@/utils/linkingHelper';
import { getRecomendacoesOptions } from '@/utils/perfilOptions';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';

// Variável de controle de login
const logado = false;

export default function ConfiguracoesScreen() {
  const [showInfoCard, setShowInfoCard] = useState(true);
  
  // Opções baseadas no schema do banco
  const recomendacoesOptions = useMemo(() => getRecomendacoesOptions(), []);

  // Gerencia estado e lógica do perfil
  const perfil = usePerfilConfig();

  // Gerencia bottom sheet de seleção
  const bottomSheet = useBottomSheetSelecao();

  // Handler para o botão de voltar do Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (bottomSheet.visible) {
        bottomSheet.close();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [bottomSheet.visible]);

  // Carrega dados do banco
  useFocusEffect(
    useCallback(() => {
      perfil.loadPerfil();
    }, [])
  );

  const handleRestricaoAlimentarSelect = (value: string | string[]) => {
    const values = Array.isArray(value) ? value : [value];
    perfil.updateRestricoes(values);
  };

  const handleAlergiasSelect = (value: string | string[]) => {
    const values = Array.isArray(value) ? value : [value];
    perfil.updateAlergias(values);
  };

  const handlePrioridadeSelect = (value: string | string[]) => {
    const prioridadeValue = Array.isArray(value) ? value[0] : value;
    perfil.updatePrioridade(prioridadeValue);
  };

  const handleNivelCozinhaSelect = (value: string | string[]) => {
    const nivelValue = Array.isArray(value) ? value[0] : value;
    perfil.updateNivelCozinha(nivelValue);
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
          <ProfileCard isLoggedIn={logado} />
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
          <ConfigItem
            title="Restrição alimentar"
            value={formatListForDisplay(perfil.restricaoAlimentar, 'Nenhuma')}
            onPress={() =>
              bottomSheet.open(
                'Restrição alimentar',
                recomendacoesOptions.restricaoAlimentar,
                perfil.restricaoAlimentar,
                handleRestricaoAlimentarSelect,
                true
              )
            }
          />

          <ConfigItem
            title="Alergias"
            value={formatListForDisplay(perfil.alergias, 'Nenhuma')}
            onPress={() =>
              bottomSheet.open(
                'Alergias',
                recomendacoesOptions.alergias,
                perfil.alergias,
                handleAlergiasSelect,
                true
              )
            }
          />

          <ConfigItem
            title="Prioridade"
            value={perfil.prioridade}
            onPress={() =>
              bottomSheet.open(
                'Prioridade',
                recomendacoesOptions.prioridade,
                perfil.prioridade,
                handlePrioridadeSelect,
                false,
                true
              )
            }
          />

          <ConfigItem
            title="Nível na cozinha"
            value={perfil.nivelCozinha}
            onPress={() =>
              bottomSheet.open(
                'Nível na cozinha',
                recomendacoesOptions.nivelCozinha,
                perfil.nivelCozinha,
                handleNivelCozinhaSelect,
                false,
                true
              )
            }
          />
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
              value={perfil.dailySuggestions}
              onValueChange={perfil.updateDailySuggestions}
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
          <ConfigItem
            title="Política de Privacidade"
            value=""
            onPress={() => openURL('https://example.com/')}
          />

          <ConfigItem
            title="Termos de Uso"
            value=""
            onPress={() => openURL('https://example.com/')}
          />

          <ConfigItem
            title="Fale Conosco"
            value=""
            onPress={() => openEmail('guilherme.araujo1535@gmail.com')}
          />
        </SectionUI>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Seção Acesso */}
        {logado && (
          <SectionUI
            title="Acesso"
            style={{
              paddingHorizontal: 20,
            }}
          >
            <ConfigItem
              title="Excluir conta"
              value=""
              onPress={() => {}}
            />

            <ConfigItem
              title="Logout"
              value=""
              valueColor={Colors.light.danger}
              showChevron={false}
              onPress={() => {}}
            />
          </SectionUI>
        )}
      </ScrollViewWithPadding>

      {/* Bottom Sheet de Seleção */}
      <BottomSheetSelecao
        visible={bottomSheet.visible}
        onClose={bottomSheet.close}
        title={bottomSheet.title}
        options={bottomSheet.options}
        selectedValue={bottomSheet.selectedValue}
        onSelect={bottomSheet.onSelect}
        multiple={bottomSheet.multiple}
        showConfirmButton={bottomSheet.showConfirmButton}
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
  divider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 8,
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
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 14,
    color: Colors.light.danger,
  },
});
