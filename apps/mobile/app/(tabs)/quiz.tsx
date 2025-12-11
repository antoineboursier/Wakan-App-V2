import { View, Text, SafeAreaView } from 'react-native';

export default function QuizScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-900 justify-center items-center">
            <Text className="text-text-primary text-2xl font-skranji">Quiz</Text>
            <Text className="text-text-secondary font-spartan mt-4">Questions introspectives</Text>
        </SafeAreaView>
    );
}
