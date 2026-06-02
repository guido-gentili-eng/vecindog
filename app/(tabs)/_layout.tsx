import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import type { ColorValue } from 'react-native';

function Icon({ emoji, active }: { emoji: string; active: boolean }) {
  return <Text style={{ fontSize: 22, opacity: active ? 1 : 0.45 }}>{emoji}</Text>;
}

function PublishIcon() {
  return (
    <View style={{
      width: 46, height: 46, borderRadius: 23,
      backgroundColor: Colors.primary,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: Platform.OS === 'ios' ? 6 : 2,
      shadowColor: Colors.primary,
      shadowOpacity: 0.45, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
      elevation: 6,
    }}>
      <Text style={{ fontSize: 26, color: '#fff', lineHeight: 30 }}>+</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.inkMuted,
        tabBarStyle: {
          backgroundColor:   Colors.white,
          borderTopColor:    Colors.border,
          borderTopWidth:    1,
          paddingBottom:     Platform.OS === 'ios' ? 20 : 6,
          paddingTop:        6,
          height:            Platform.OS === 'ios' ? 80 : 64,
        },
        tabBarLabelStyle:    { fontSize: 10, fontWeight: '600', marginTop: 2 },
        headerShown:         false,
      }}
    >
      <Tabs.Screen name="index"
        options={{ title: 'Inicio',    tabBarIcon: ({ focused }) => <Icon emoji="🏠" active={focused} /> }}
      />
      <Tabs.Screen name="avisos"
        options={{ title: 'Avisos',    tabBarIcon: ({ focused }) => <Icon emoji="🔍" active={focused} /> }}
      />
      <Tabs.Screen name="publicar"
        options={{ title: '',          tabBarIcon: () => <PublishIcon />, tabBarLabel: () => null }}
      />
      <Tabs.Screen name="mapa"
        options={{ title: 'Mapa',      tabBarIcon: ({ focused }) => <Icon emoji="🗺️" active={focused} /> }}
      />
      <Tabs.Screen name="mis-perros"
        options={{ title: 'Mis perros', tabBarIcon: ({ focused }) => <Icon emoji="🐶" active={focused} /> }}
      />
      <Tabs.Screen name="perfil"
        options={{ title: 'Perfil',    tabBarIcon: ({ focused }) => <Icon emoji="👤" active={focused} /> }}
      />
    </Tabs>
  );
}
