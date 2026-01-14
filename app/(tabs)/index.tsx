import { CardReceita } from '@/components/card-receita';
import { CardReceitaFazer } from '@/components/card-receita-fazer';
import { PasswordStrength } from '@/components/password-strength';
import { ButtonUI } from '@/components/ui/button';
import { InputUI } from '@/components/ui/input';
import { InputPasswordUI } from '@/components/ui/input-password';
import { InputSearchUI } from '@/components/ui/input-search';
import { PageTitle } from '@/components/ui/page-title';
import { TextUI } from '@/components/ui/text';
import { Toggle } from '@/components/ui/toggle';
import { Colors } from '@/constants/theme';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [toggleEnabled, setToggleEnabled] = useState(false);
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchText, setSearchText] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: Colors.light.white }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingHorizontal: 20, paddingVertical: 20, gap: 10 }}>
            <ButtonUI variant="primary" title="Button" onPress={() => { }} />
            <ButtonUI variant="secondary" title="Button" onPress={() => { }} />
            <ButtonUI variant="tertiary" title="Button" onPress={() => { }} />
            <ButtonUI variant="primary" title="Button" disabled={true} onPress={() => { }} />
            <ButtonUI variant="primary" title="Button" disabled={true} loading={true} onPress={() => { }} />
            <TextUI variant="bold" style={{ textAlign: 'center' }}>
              ----------------------------------------------
            </TextUI>
            <PageTitle title="Page Title" onBackPress={() => { }} />
            <PageTitle title="Page Title" />
            <TextUI variant="bold" style={{ textAlign: 'center' }}>
              ----------------------------------------------
            </TextUI>
            <Toggle value={toggleEnabled} onValueChange={setToggleEnabled} />
            <TextUI variant="bold" style={{ textAlign: 'center' }}>
              ----------------------------------------------
            </TextUI>
            <InputUI
              placeholder="Digite algo..."
              value={inputValue1}
              onChangeText={setInputValue1}
            />
            <InputUI
              placeholder="Digite algo..."
              value={inputValue1}
              borderColor="success"
              onChangeText={setInputValue1}
            />
            <InputUI
              placeholder="Digite algo..."
              value={inputValue2}
              borderColor="error"
              onChangeText={setInputValue2}
            />

            <InputPasswordUI
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
            />

            <InputPasswordUI
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              borderColor="success"
            />

            <InputPasswordUI
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              borderColor="error"
            />

            <InputSearchUI
              placeholder="Buscar..."
              value={searchText}
              borderColor="success"
              onChangeText={setSearchText}
            />
            <InputSearchUI
              placeholder="Buscar..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <TextUI variant="bold" style={{ textAlign: 'center' }}>
              ----------------------------------------------
            </TextUI>
            <PasswordStrength password={password} />
            <TextUI variant="bold" style={{ textAlign: 'center' }}>
              ----------------------------------------------
            </TextUI>
            <CardReceita
              imageUri={"https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg"}
              category="Sushi"
              title="Sushi de Salmão"
              time="10 minutos"
              servings="2 porções"
              difficulty="Fácil"
              onPress={() => { }}
            />
            <TextUI variant="bold" style={{ textAlign: 'center' }}>
              ----------------------------------------------
            </TextUI>

            <CardReceitaFazer
              imageUri={"https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg"}
              title="Frango com legumes"
              time="20 min"
              servings="1 pessoa"
              description="Usa o que você tem em casa"
              onFazerAgora={() => console.log('Fazer agora')}
              onProxima={() => console.log('Próxima')}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
} 
