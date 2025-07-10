// /components/NavigationBar.jsx

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FONT_SIZES, COLORS } from '../lib/utils/enums';

const navItems = [
  { name: 'Dashboard', icon: 'home-outline', path: '/dashboard' },
  { name: 'Reservation', icon: 'business-outline', path: '/reservations' },
  { name: 'Services', icon: 'construct-outline', path: '/services' },
  { name: 'Inventory', icon: 'cube-outline', path: '/inventory' },
];

export default function NavigationBar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {navItems.map((item) => {

        return (
          <TouchableOpacity
            key={item.path}
            style={styles.item}
            onPress={() => router.replace('/tabs' + item.path)}
          >
            <Ionicons
              name={item.icon}
              size={FONT_SIZES.title_two}
              color={COLORS.gray}
            />
            <Text style={[styles.label]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: COLORS.offwhite,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
});
