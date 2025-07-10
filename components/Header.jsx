// /components/Header.jsx
import { View, Image, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
});
