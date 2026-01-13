import { ButtonUI } from '@/components/ui/button';
import { InputUI } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { TextUI } from '@/components/ui/text';
import { Toggle } from '@/components/ui/toggle';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [toggleEnabled, setToggleEnabled] = useState(false);

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <ScrollView>
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
          <InputUI placeholder="Enter password" />
          <InputUI placeholder="Password" status="focus" />
          <InputUI placeholder="Password" status="error" />
          <InputUI placeholder="Password" status="success" />
          <InputUI
            placeholder="Password"
            secureTextEntry
          />
          <InputUI
            placeholder="Search"
            value="Search"
            onChangeText={() => { }}
            showClear
          />
          <TextUI variant="bold" style={{ textAlign: 'center' }}>
            ----------------------------------------------
          </TextUI>

        </View>
      </ScrollView>
    </View>
  );
} 
