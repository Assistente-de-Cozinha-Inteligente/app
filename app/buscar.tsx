import { PreferenciaSlider } from '@/components/preferencia-slider';
import { ReceitaSlider } from '@/components/receita-slider';
import { InputSearchUI } from '@/components/ui/input-search';
import { PageTitle } from '@/components/ui/page-title';
import { SectionUI } from '@/components/ui/section';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Importar imagens locais
const imagem1 = require('@/assets/images/testes/1.png');
const imagem2 = require('@/assets/images/testes/2.png');
const imagem3 = require('@/assets/images/testes/3.png');

export default function BuscarScreen() {
  const [search, setSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Torta', 'Arroz', 'Peixe']);
  const searchInputRef = useRef<any>(null);

  const preferencias = [
    {
      imageUri: imagem2,
      title: "Veganos",
      color: "#F2F2F2",
      backgroundColor: "#ECECEC",
    },
    {
      imageUri: imagem3,
      title: "Carnivoros",
      color: "#F5EFE6",
      backgroundColor: "#EFE6D8",
    },
    {
      imageUri: imagem1,
      title: "Vegeta",
      color: "#F7ECEC",
      backgroundColor: "#F1E2E2",
    },
  ];

  const handleRemoveSearch = (index: number) => {
    setRecentSearches(recentSearches.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setRecentSearches([]);
  };

  // Focar automaticamente no input quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      // Pequeno delay para garantir que a tela está totalmente renderizada
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );
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
      <View style={styles.header}>
        <PageTitle
          title="Buscar"
          onBackPress={() => router.back()}
        />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        {/* Barra de pesquisa */}
        <SectionUI
          title=""
          style={{
            marginBottom: 24,
            paddingHorizontal: 20,
          }}>
          <InputSearchUI
            ref={searchInputRef}
            placeholder="Digite para encontrar receitas..."
            value={search}
            onChangeText={setSearch}
          />
        </SectionUI>

        {/* Pesquisas recentes */}
        {recentSearches.length > 0 && (
          <SectionUI
            title="Pesquisa recente"
            style={{
              marginBottom: 24,
              paddingHorizontal: 20,
            }}
            titleStyle={{
              paddingHorizontal: 0,
            }}
            rightButton={
              <Pressable onPress={handleClearAll}>
                <TextUI variant="light" style={styles.clearAllText}>
                  Excluir tudo
                </TextUI>
              </Pressable>
            }>
            <View style={styles.recentSearchesContainer}>
              {recentSearches.map((searchTerm, index) => (
                <View key={index} style={styles.recentSearchItem}>
                  <TextUI variant="regular" style={styles.recentSearchText}>
                    {searchTerm}
                  </TextUI>
                  <TouchableOpacity
                    onPress={() => handleRemoveSearch(index)}
                    style={styles.removeButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={18} color={Colors.light.bodyText} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </SectionUI>
        )}

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

        {/* Preferências */}
        <SectionUI
          title="Preferências"
          style={{
            marginBottom: 24,
          }}
          titleStyle={{
            paddingHorizontal: 20,
          }}
          rightButtonStyle={{
            paddingHorizontal: 20,
          }}
          rightButton={
            <Pressable>
              <TextUI variant="light" style={styles.seeAllText}>
                Ver tudo
              </TextUI>
            </Pressable>
          }>
          <PreferenciaSlider preferencias={preferencias} />
        </SectionUI>
      </ScrollView>
    </ViewContainerUI>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  recentSearchesContainer: {
    gap: 12,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  recentSearchText: {
    fontSize: 14,
    color: Colors.light.mainText,
    flex: 1,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearAllText: {
    fontSize: 14,
    color: Colors.light.bodyText,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.light.bodyText,
  },
});

