import { Tabs } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.inkMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor:  Colors.border,
          paddingBottom:   4,
          height:          60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle:      { backgroundColor: Colors.white },
        headerTintColor:  Colors.ink,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Inicio', tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} /> }}
      />
      <Tabs.Screen
        name="avisos"
        options={{ title: 'Avisos', tabBarIcon: ({ color }) => <TabIcon emoji="🔍" color={color} /> }}
      />
      <Tabs.Screen
        name="publicar"
        options={{
          title: 'Publicar',
          tabBarIcon: () => (
            <TabIconPublish />
          ),
        }}
      />
      <Tabs.Screen
        name="mis-perros"
        options={{ title: 'Mis perros', tabBarIcon: ({ color }) => <TabIcon emoji="🐶" color={color} /> }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Perfil', tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} /> }}
      />
    </Tabs>
  );
}

import { Text, View } from 'react-native';

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return <Text style={{ fontSize: 22, opacity: color === Colors.primary ? 1 : 0.5 }}>{emoji}</Text>;
}

function TabIconPublish() {
  return (
    <View style={{
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: Colors.primary,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 4,
      shadowColor: Colors.primary,
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    }}>
      <Text style={{ fontSize: 24, color: '#fff', lineHeight: 28 }}>+</Text>
    </View>
  );
}
