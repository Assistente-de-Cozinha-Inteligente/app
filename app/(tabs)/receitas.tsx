import { CategoriaSlider } from '@/components/categoria-slider';
import { PreferenciaSlider } from '@/components/preferencia-slider';
import { ReceitaSlider } from '@/components/receita-slider';
import { ReceitaSliderCompacto } from '@/components/receita-slider-compacto';
import { InputSearchUI } from '@/components/ui/input-search';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { SectionUI } from '@/components/ui/section';
import { ViewContainerUI } from '@/components/ui/view-container';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';

// Importar imagens locais
const imagem1 = require('@/assets/images/testes/1.png');
const imagem2 = require('@/assets/images/testes/2.png');
const imagem3 = require('@/assets/images/testes/3.png');

export default function ReceitasScreen() {
  const [search, setSearch] = useState('');

  const categorias = [
    { id: '1', title: 'Geral' },
    { id: '2', title: 'Rápidas' },
    { id: '3', title: 'Pouco esforço' },
    { id: '4', title: 'Leves' },
  ];

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
      status: "Consegue fazer agora",
      onPress: () => console.log('Sushi'),
    },
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      category: "Sushi",
      title: "Sushi",
      time: "35 min",
      servings: "2 pessoas",
      difficulty: "Fácil",
      status: "Falta 2 ingredientes",
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
      <ScrollViewWithPadding
        keyboardShouldPersistTaps="handled"
      >
      <PageHeader
        style={{
          paddingHorizontal: 20,
        }}
          title="Receitas"
          description="Explore opções quando quiser"
        rightComponent={
          <Ionicons name="notifications-outline" size={26} color="black" />
        }
      />

        <SectionUI title=""
          style={{
            marginBottom: 0,
          paddingHorizontal: 20,
        }}>
          <InputSearchUI
            placeholder="Pesquisar receita"
            value={search}
            onChangeText={setSearch}
            onPress={() => router.push('/buscar')}
          />
        </SectionUI>
        <SectionUI
          title=""
          style={{
            marginBottom: 16,
            paddingVertical: 0,
          }}>
          <PreferenciaSlider preferencias={preferencias} />
        </SectionUI>

        <SectionUI
          title=""
          style={{
            marginBottom: 16,
            paddingVertical: 0,
          }}>
          <CategoriaSlider
            categorias={categorias}
            onCategoriaChange={(categoriaId) => {
              console.log('Categoria selecionada:', categoriaId);
            }}
          />
        </SectionUI>

        <SectionUI
          title="Com seus ingredientes"
          style={{
            marginBottom: 25,
            paddingVertical: 0,
          }}
          titleStyle={{
          paddingHorizontal: 20,
        }}>
          <ReceitaSlider receitas={receitas} />
        </SectionUI>

        <SectionUI
          title="Para variar"
          style={{
            marginBottom: 10,
            paddingVertical: 0,
          }}
          titleStyle={{
          paddingHorizontal: 20,
        }}>
          <ReceitaSliderCompacto receitas={receitas} />
        </SectionUI>
      </ScrollViewWithPadding>
    </ViewContainerUI>
  );
} 
