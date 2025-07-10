// components/RequestOverview.jsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, STYLES } from '../lib/utils/enums';
import { router } from 'expo-router';
import { getColor, TEXTS } from '../lib/utils/theme';

export default function RequestOverview({
  title = 'Title',
  details = ['Details not available'],
  path = null,
  timestamp = 'Datetime not available',
  status = -1
}) {
  const statusColor = getColor({ byStatus: status });

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: statusColor, borderColor: statusColor }]}
        onPress={() => path && router.push(path)}
        disabled={!path}
      >

        <View style={styles.request}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.description}>
            {details.map((item, index) => (
              <Text style={styles.text} key={index}>
                {item}
              </Text>
            ))}
          </View>

          <Text style={[TEXTS.small, styles.timestamp]}>Created: {timestamp}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    marginBottom: STYLES.BODY_PADDING,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: STYLES.PADDING,
    borderRadius: STYLES.BORDER_RADIUS,
    alignItems: 'center',
    borderWidth: STYLES.BORDER_WIDTH,
  },
  request: {
    backgroundColor: 'white',
    width: '100%',
  },
  title: {
    padding: STYLES.GAP,
    fontSize: FONT_SIZES.large,
    fontWeight: '500',
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  description: {
    flexDirection: 'column',
    padding: STYLES.PADDING,
    paddingVertical: STYLES.GAP / 2,
  },
  text: {
    color: COLORS.gray,
    fontSize: FONT_SIZES.medium,
  },
  timestamp: {
    padding: STYLES.PADDING / 2,
    textAlign: 'right',
  },
});
