import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background-900">
      <SafeAreaView className="flex-1">
        <ScrollView className="px-4">
          {/* Header */}
          <View className="mt-6 mb-8">
            <Text className="text-text-primary font-skranji text-title-big text-center">
              Wakan
            </Text>
            <Text className="text-text-secondary font-spartan text-para text-center mt-2">
              Lune du jour
            </Text>
          </View>

          {/* Lunar Card (Simulé pour l'instant) */}
          <View className="bg-background-800 rounded-3xl p-6 mb-6 items-center border border-background-700">
            <View className="w-32 h-32 bg-background-700 rounded-full mb-4 items-center justify-center">
              <Text className="text-4xl">🌑</Text>
            </View>
            <Text className="text-text-primary font-skranji text-2xl">Nouvelle Lune</Text>
            <Text className="text-accent-500 font-spartan mt-1">Illumination 0%</Text>
          </View>

          {/* Astro Quick View */}
          <View className="bg-background-800 rounded-2xl p-4 mb-6 flex-row items-center border border-background-700">
            <View className="w-12 h-12 bg-accent-900 rounded-full mr-4 items-center justify-center">
              <Text>♈</Text>
            </View>
            <View>
              <Text className="text-text-primary font-spartan font-bold">Bélier</Text>
              <Text className="text-text-tertiary text-sm">Signe solaire</Text>
            </View>
          </View>

          {/* Quick Actions Grid */}
          <View className="flex-row flex-wrap justify-between">
            {/* Tirages */}
            <Pressable className="w-[48%] bg-background-800 rounded-2xl p-4 mb-4 border border-background-700 h-32 justify-between">
              <Text className="text-2xl">ᚠ</Text>
              <Text className="text-text-primary font-skranji text-lg">Tirages</Text>
            </Pressable>

            {/* Quiz */}
            <Pressable className="w-[48%] bg-background-800 rounded-2xl p-4 mb-4 border border-background-700 h-32 justify-between">
              <Text className="text-2xl">❓</Text>
              <Text className="text-text-primary font-skranji text-lg">Quiz</Text>
            </Pressable>
          </View>

        </ScrollView>
      </SafeAreaView>
      <StatusBar style="light" />
    </View>
  );
}
