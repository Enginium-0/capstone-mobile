// components/CreateButton.jsx
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Developer's Library
import { TAGS, TEXTS } from '../lib/utils/theme';

export default function CreateButton({ to }) {

  const router = useRouter();
  const location = () => {
    if (to) {
      router.push(to);
    }
  }
  return (
    <TouchableOpacity onPress={location} style={TAGS.button}>
      <Ionicons name="add" size={24} style={TEXTS.button} />
    </TouchableOpacity>
  );
}
