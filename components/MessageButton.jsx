// /components/MessageButton.jsx
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Developer's Library
import { TAGS, TEXTS } from '../lib/utils/theme';

export default function MessageButton({ to }) {
  const router = useRouter();

  const navigate = () => {
    if (to) {
      router.push(to);
    }
  };

  return (
    <TouchableOpacity onPress={navigate} style={TAGS.button}>
      <Ionicons name="chatbubble-ellipses-outline" size={24} style={TEXTS.button} />
    </TouchableOpacity>
  );
}
