import { ReceitaSlider } from '@/components/receita-slider';
import { ReceitaSliderFazer } from '@/components/receita-slider-fazer';
import { PageHeader } from '@/components/ui/page-header';
import { SectionUI } from '@/components/ui/section';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, ScrollView, View } from 'react-native';

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
      onPress: () => console.log('Sushi'),
    },
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      category: "Sushi",
      title: "Sushi",
      time: "35 min",
      servings: "2 pessoas",
      difficulty: "Fácil",
      onPress: () => console.log('Sushi 2'),
    },
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      category: "Sushi",
      title: "Sushi",
      time: "35 min",
      servings: "2 pessoas",
      difficulty: "Fácil",
      onPress: () => console.log('Sushi 3'),
    },
  ];

  return (
    <ViewContainerUI>

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
      <ScrollView
        keyboardShouldPersistTaps="handled"
      >
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
          marginBottom: 70,
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
      </ScrollView>
    </ViewContainerUI>
  );
} 
