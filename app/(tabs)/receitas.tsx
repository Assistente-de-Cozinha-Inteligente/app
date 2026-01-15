import { PreferenciaSlider } from '@/components/preferencia-slider';
import { ReceitaSlider } from '@/components/receita-slider';
import { InputSearchUI } from '@/components/ui/input-search';
import { PageHeader } from '@/components/ui/page-header';
import { SectionUI } from '@/components/ui/section';
import { ViewContainerUI } from '@/components/ui/view-container';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ScrollView } from 'react-native';

// Importar imagens locais
const imagem1 = require('@/assets/images/testes/1.png');
const imagem2 = require('@/assets/images/testes/2.png');
const imagem3 = require('@/assets/images/testes/3.png');

export default function ReceitasScreen() {
  const [search, setSearch] = useState('');

  const preferencias = [
    {
      imageUri: imagem2,
      title: "Veganos",
      color: "#F2F2F2",          // cinza claro (card)
      backgroundColor: "#ECECEC", // cinza levemente mais escuro (fundo da imagem)
    },
    {
      imageUri: imagem3,
      title: "Carnívoro",
      color: "#F5EFE6",          // bege suave
      backgroundColor: "#EFE6D8", // bege um pouco mais quente
    },
    {
      imageUri: imagem1,
      title: "Vegetariano",
      color: "#F7ECEC",          // rosado bem fraco
      backgroundColor: "#F1E2E2", // rosado levemente mais presente
    },
    {
      imageUri: imagem2,
      title: "Pescetariano",
      color: "#EEF1F6",          // azul acinzentado claro
      backgroundColor: "#E3E8F0", // azul acinzentado um pouco mais profundo
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
        title="Receitas"
        description="Explore opções quando quiser"
        rightComponent={
          <Ionicons name="notifications-outline" size={26} color="black" />
        }
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
      >

        <SectionUI title=""
          style={{
            marginBottom: 0,
            paddingHorizontal: 20,
          }}>
          <InputSearchUI
            placeholder="Pesquisar receita"
            value={search}
            onChangeText={setSearch}
          />
        </SectionUI>
        <SectionUI
          title=""
          style={{
            marginBottom: 15,
            paddingVertical: 0,
          }}>
          <PreferenciaSlider preferencias={preferencias} />
        </SectionUI>

        {/* <ReceitaSlider receitas={receitas} /> */}
      </ScrollView>
    </ViewContainerUI>
  );
} 
