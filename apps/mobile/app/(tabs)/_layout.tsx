import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { colors } from '@repo/tokens/src/colors';

// Placeholder icons function until Phase 3.2
function TabIcon({ name, color, focused }: { name: string; color: string; focused: boolean }) {
    // Simple text placeholder or eventually vector icons
    return <Text style={{ color, fontSize: 18 }}>{name}</Text>;
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background[800],
                    borderTopColor: colors.background[700],
                    borderTopWidth: 1,
                    height: 80,
                    paddingBottom: 20,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: colors.accent[500],
                tabBarInactiveTintColor: colors.text.tertiary,
                tabBarLabelStyle: {
                    fontFamily: 'LeagueSpartan_400Regular',
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Accueil',
                    tabBarIcon: ({ color, focused }) => <TabIcon name="🌑" color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="tirages"
                options={{
                    title: 'Tirages',
                    tabBarIcon: ({ color, focused }) => <TabIcon name="ᚠ" color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="quiz"
                options={{
                    title: 'Quiz',
                    tabBarIcon: ({ color, focused }) => <TabIcon name="❓" color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="journal"
                options={{
                    title: 'Journal',
                    tabBarIcon: ({ color, focused }) => <TabIcon name="📖" color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="profil"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, focused }) => <TabIcon name="👤" color={color} focused={focused} />,
                }}
            />
        </Tabs>
    );
}
