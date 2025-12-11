import { View, Text, ScrollView, SafeAreaView, Pressable, ImageBackground, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const bgHome = require('../../assets/images/bg_home_default.png');
const imgTirages = require('../../assets/images/card_tirages.png');
const imgQuiz = require('../../assets/images/card_quiz.png');

export default function HomeScreen() {
  return (
    <ImageBackground source={bgHome} className="flex-1" resizeMode="cover">
      <SafeAreaView className="flex-1">
        <ScrollView className="px-4">
          {/* Header */}
          <View className="mt-8 mb-8">
            <Text className="text-text-primary font-skranji text-title-big text-center">
              WaKan
            </Text>
            <Text className="text-text-secondary font-spartan text-para text-center mt-2 uppercase tracking-widest text-xs">
              Lune du jour
            </Text>
          </View>

          {/* Lunar Card (Simulé) */}
          <View className="bg-background-800/80 rounded-3xl p-6 mb-6 items-center border border-background-700/50 backdrop-blur-md">
            <View className="w-32 h-32 bg-background-700/50 rounded-full mb-4 items-center justify-center border border-background-600">
              <Text className="text-5xl">🌑</Text>
            </View>
            <Text className="text-text-primary font-skranji text-2xl text-center">Nouvelle Lune</Text>
            <Text className="text-accent-500 font-spartan mt-1">Illumination 1% - Scorpion</Text>
          </View>

          {/* Astro Quick View */}
          <View className="bg-background-800/80 rounded-2xl p-4 mb-6 flex-row items-center border border-background-700/50">
            <View className="w-12 h-12 bg-accent-900 rounded-full mr-4 items-center justify-center">
              <Text className="text-xl">♈</Text>
            </View>
            <View>
              <Text className="text-text-primary font-spartan font-bold text-lg">Bélier</Text>
              <Text className="text-text-tertiary text-sm">Signe solaire</Text>
            </View>
          </View>

          {/* Quick Actions Grid */}
          <View className="flex-row flex-wrap justify-between">
            {/* Tirages */}
            <Pressable className="w-[48%] h-40 rounded-2xl mb-4 overflow-hidden border border-background-700/50">
              <ImageBackground source={imgTirages} className="flex-1 p-4 justify-between" resizeMode="cover">
                <View className="bg-background-900/40 p-1.5 rounded-full w-8 h-8 items-center justify-center self-end">
                  <Text className="text-lg text-white">ᚠ</Text>
                </View>
                <Text className="text-text-primary font-skranji text-lg drop-shadow-md">Tirages</Text>
              </ImageBackground>
            </Pressable>

            {/* Quiz */}
            <Pressable className="w-[48%] h-40 rounded-2xl mb-4 overflow-hidden border border-background-700/50">
              <ImageBackground source={imgQuiz} className="flex-1 p-4 justify-between" resizeMode="cover">
                <View className="bg-background-900/40 p-1.5 rounded-full w-8 h-8 items-center justify-center self-end">
                  <Text className="text-lg text-white">❓</Text>
                </View>
                <Text className="text-text-primary font-skranji text-lg drop-shadow-md">Quiz</Text>
              </ImageBackground>
            </Pressable>
          </View>

        </ScrollView>
      </SafeAreaView>
      <StatusBar style="light" />
    </ImageBackground>
  );
}
