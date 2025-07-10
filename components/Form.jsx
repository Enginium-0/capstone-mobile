// components/Form.jsx
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome } from '@expo/vector-icons'

import { TEXTS, FORMS, TAGS } from '../lib/utils/theme.js';
import { COLORS, FONT_SIZES, STYLES } from '../lib/utils/enums.js';

export function FileUpload({ label, file, onPick }) {
  const pickFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'] });

      if (result.canceled || !result.assets?.[0]) return;

      const selectedFile = result.assets[0];
      const isPdf = selectedFile.name.toLowerCase().endsWith('.pdf');
      const isImage = selectedFile.mimeType?.startsWith('image/');

      if (!isPdf && !isImage) {
        Alert.alert('Invalid File', 'Only PDF or image files are allowed.');
        return;
      }

      onPick?.(selectedFile);
    } catch (e) {
      Alert.alert('File selection failed', e.message || 'Unknown error');
    }
  }, [onPick]);

  const clearFile = () => {
    onPick?.(null);
  };

  return (
    <View style={FORMS.field}>
      <Text style={TEXTS.label}>{label}</Text>

      <TouchableOpacity
        onPress={pickFile}
        style={[
          FORMS.input,
          {
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: file ? 8 : 0,
          },
        ]}
      >
        <Text>{file ? file.name : 'Upload File'}</Text>
      </TouchableOpacity>

      {file && (
        <TouchableOpacity onPress={clearFile} style={[FORMS.input, FORMS.remove]}>
          <Text style={TEXTS.remove}>Remove File</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function TextAreaField({ label, value, onChange, maxLength = 255, onValidate, placeholder = '' }) {
  const isValid = /^[a-zA-Z0-9 ]*$/.test(value);

  useEffect(() => {
    onValidate?.(isValid);
  }, [isValid, onValidate]);

  return (
    <View style={FORMS.field}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={TEXTS.label}>{label}</Text>
        <Text style={{ color: 'gray' }}>{`${value.length}/${maxLength}`}</Text>
      </View>
      {!isValid && <Text style={{ color: 'red' }}>Only letters, numbers, and spaces allowed.</Text>}
      <TextInput
        multiline
        style={[FORMS.input, {padding: STYLES.PADDING}]}
        value={value}
        onChangeText={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
      />
    </View>
  );
}

export function SubmitButton({ enabled, onPress, label = 'Submit' }) {
  return (
    <TouchableOpacity
      disabled={!enabled}
      onPress={onPress}
      style={[
        TAGS.button,
        FORMS.submit,
        { backgroundColor: enabled ? COLORS.primary : COLORS.disabled }
      ]}
    >
      <Text style={TEXTS.button}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select option',
  style,
  noLabel = false,
}) {
  const selected = value;
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <View style={[FORMS.field, style]}>
      {!noLabel && <Text style={TEXTS.label}>{label}</Text>}
      <View style={FORMS.input}>
        <Picker selectedValue={selected} onValueChange={onChange}>
          <Picker.Item label={placeholder} value="" style={TEXTS.placeholder} />
          {safeOptions.map(([key, obj], index) => (
            <Picker.Item key={`${key}-${index}`} label={obj.name} value={key} />
          ))}
        </Picker>
      </View>
    </View>
  );
}


export function SelectFarm({
  label = 'Area',
  value = [],
  onChange,
  options = [],
  repeatable = true,
}) {
  const [fields, setFields] = useState(value.length ? value : []);

  useEffect(() => {
    onChange?.(fields.filter(Boolean));
  }, [fields]);

  const handleAdd = () => {
    if (fields.length < options.length) {
      setFields(prev => [...prev, '']);
    }
  };

  const handleChange = (newValue, index) => {
    const updated = [...fields];
    updated[index] = newValue;
    setFields(updated);
  };

  const handleRemove = (index) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  const selectedValues = fields.filter(Boolean);
  const canAddMore = repeatable || selectedValues.length < options.length;
  const hasOptions = options.length > 0;

  return (
    <View style={FORMS.field}>
      <Text style={TEXTS.label}>{label}</Text>

      {!hasOptions && (
        <Text style={{ color: COLORS.red, fontStyle: 'italic', marginBottom: 5 }}>
          No options available.
        </Text>
      )}

      {fields.map((val, idx) => {
        const filteredOptions = repeatable
          ? options
          : options.filter(([key]) => !selectedValues.includes(key) || key === val);

        return (
          <View key={idx} style={[TAGS.header, { alignItems: 'center' }]}>
            <SelectField
              value={val}
              onChange={(v) => handleChange(v, idx)}
              options={filteredOptions}
              noLabel={true}
              style={[TAGS.flexItem, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => handleRemove(idx)} style={[FORMS.input, FORMS.remove, {
              borderRadius: 30,
              marginLeft: 8,
            }]}>
              <View style={{ width: 30, justifyContent: 'center', alignItems: 'center' }}>
                <FontAwesome name="minus" size={16} color={COLORS.red} />
              </View>
            </TouchableOpacity>

          </View>
        );
      })}

      {hasOptions && canAddMore && (
        <TouchableOpacity
          onPress={handleAdd}
          style={[TAGS.button, { height: STYLES.INPUT_HEIGHT }]}
        >
          <Text style={TEXTS.button}>+ Add item</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
