import { CardPreferenciasIA } from '@/components/card-preferencias-ia';
import { CronometroOferta } from '@/components/cronometro-oferta';
import { ReceitaSlider } from '@/components/receita-slider';
import { ReceitaSliderFazer } from '@/components/receita-slider-fazer';
import { ButtonUI } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { SectionUI } from '@/components/ui/section';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { testSelectDao } from '@/data/local/dao/testDao';
import { getOrCreateLocalUser } from '@/data/local/dao/usuarioDao';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';

export default function HomeScreen() {
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

  useFocusEffect(() => {
    const user = getOrCreateLocalUser().then((user) => {
      console.log(user, "(<<<<<<<<< ID do usuário <<<<<<<<<)");
    });
  });
  return (
    <ViewContainerUI isTabBar={true} exibirIA={true}>
      <ButtonUI title="Testar" onPress={() =>
        testSelectDao(`SELECT * FROM ingredientes where id = 1`).then((result) => {
          console.log(result, "(<<<<<<<<< Resultado da consulta <<<<<<<<<)");
        })} />
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
        <SectionUI title="" style={{
          paddingHorizontal: 20,
          marginBottom: 20,
        }}>
          <CronometroOferta variant="compact" />
        </SectionUI>

        <SectionUI title="" style={{
          paddingHorizontal: 20,
          marginBottom: 20,
        }}>
          <CardPreferenciasIA
            preferencias={[
              { id: '1', text: 'Você costuma preferir receitas rápidas.', icon: 'flash-outline' },
              { id: '2', text: 'Você evita receitas com muitos passos.', icon: 'remove-circle-outline' },
              { id: '3', text: 'Você usa frango com frequência.', icon: 'restaurant-outline' },
            ]}
          />
        </SectionUI>

        <ButtonUI title="PAGAR" onPress={() => router.push('/paywall')} style={{
          marginHorizontal: 20,
          marginBottom: 20,
        }} />

        <ButtonUI title="Login" onPress={() => router.push('/login?modo=assinatura')} style={{
          marginHorizontal: 20,
          marginBottom: 20,
        }} />

        <ButtonUI title="Registrar" onPress={() => router.push('/registro?modo=assinatura')} style={{
          marginHorizontal: 20,
          marginBottom: 20,
        }} />

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
