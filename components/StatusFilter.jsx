// components/StatusFilter.jsx
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, STYLES, FONT_SIZES } from '../lib/utils/enums';

const STATUSES = [
  { label: 'All', value: null},
  { label: 'Pending', value: 0 },
  { label: 'Ongoing', value: 1 },
  { label: 'To Rate', value: 2 },,
];

export default function StatusFilter({ selected, onChange }) {
  return (
    <View style={styles.container}>
      {STATUSES.map((status) => (
        <TouchableOpacity
          key={status.value}
          onPress={() => onChange(status.value)}
          style={[
            styles.button,
            selected === status.value && styles.activeButton,
          ]}
        >
          <Text
            style={[
              styles.text,
              selected === status.value && styles.activeText,
            ]}
          >
            {status.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const height = 58;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: STYLES.PADDING,
    backgroundColor: COLORS.brownLight,
    height: height,
    borderRadius: height / 2,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: STYLES.PADDING / 2,
  },
  button: {
    paddingVertical: 8,
    borderRadius: (height - STYLES.PADDING) / 2,
    borderWidth: STYLES.BORDER_WIDTH,
    borderColor: COLORS.brownLight,
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: FONT_SIZES.medium,
    color: 'white',
  },
  activeText: {
    fontWeight: '500',
  },
});
