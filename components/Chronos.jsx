// components/Chronos.jsx

import { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TEXTS, FORMS } from '../lib/utils/theme';
import { COLORS } from '../lib/utils/enums';

export function DateInput({ label = 'Date', value, onChange, minimum }) {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(false);
    if (Platform.OS === 'android' && event.type !== 'set') return;
    if (selectedDate) {
      onChange?.(selectedDate);
    }
  };

  const formattedDate = value ? new Date(value).toLocaleDateString() : 'Select Date';

  return (
    <View style={FORMS.field}>
      <Text style={TEXTS.label}>{label}</Text>
      <TouchableOpacity
        style={[FORMS.input, { justifyContent: 'center', paddingHorizontal: 12 }]}
        onPress={() => setShow(true)}
      >
        <Text style={{ color: value ? COLORS.black : COLORS.placeholder }}>
          {formattedDate}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          minimumDate={minimum || new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
}
