// app/_layout.jsx

// Imported React Native Libraries
import { Stack } from 'expo-router';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { STYLES, COLORS } from '../lib/utils/enums';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000', position: 'relative' }} edges={['bottom']}>
        <View style={styles.container}>
          <View style={styles.stackWrapper}>
            <Stack
              screenOptions={{
                headerTitle: () => <Header />,
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#fff' },
                contentStyle: { flex: 1 },
              }}
            />
          </View>
          <NavigationBar />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  stackWrapper: {
    flex: 1,
    paddingBottom: STYLES.NAVIGATION_BAR_HEIGHT,
  },
});
