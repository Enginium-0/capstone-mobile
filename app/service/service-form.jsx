// app/forms/service-form.jsx

import { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';

import {
  TAGS,
  TEXTS,
} from '../../lib/utils/theme.js';

import {
  SelectField,
  TextAreaField,
  SubmitButton,
  FileUpload,
} from '../../components/Form.jsx';

import { postServiceRequest } from '../../lib/controllers/ServiceController.js';
import { getLocations } from '../../lib/controllers/LocationController.js';
import { getVenues } from '../../lib/controllers/VenueController.js';
import { getGroups } from '../../lib/controllers/GroupController.js';
import { getEquipments } from '../../lib/controllers/EquipmentController.js';
import { uploadFileAsync, isSuccess } from '../../lib/utils/form.js';
import { user } from '../../dev/temp.js';

export default function ServiceForm() {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [venues, setVenues] = useState([]);
  const [venue, setVenue] = useState('');
  const [nature, setNature] = useState('');
  const [problem, setProblem] = useState('');
  const [items, setItems] = useState('');
  const [groups, setGroups] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [problemValid, setProblemValid] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [onhold, setOnHold] = useState(false);

  useEffect(() => {
    (async () => {
      const results = await getLocations({ hideDefault: true });
      setLocations(results.map((loc) => [loc.code, loc]));
    })();
  }, []);

  useEffect(() => {
    setItems('');
    if (!location) return setVenues([]);
    (async () => {
      const results = await getVenues({ byLocation: location });
      setVenues(results.map((v) => [v.code, v]));
    })();
  }, [location]);

  useEffect(() => {
    if (!venue) return setGroups([]);
    (async () => {
      const equipment = await getEquipments({ byVenue: venue, byHidden: false });
      const matched = await getGroups({ byEquipments: equipment });
      setGroups(matched.map((g) => [g.code, g]));
    })();
  }, [venue]);

  useEffect(() => {
    const ready = location && venue && nature && problem && problemValid && !onhold;
    setSubmitEnabled(ready);
  }, [location, venue, nature, problem, problemValid, onhold]);

  const handleSubmit = async () => {
    setOnHold(true);
    const form = { location, venue, nature, problem: problem.trim(), item: items || null, image: imageFile };
    const success = await postServiceRequest(form, user);
    isSuccess(success, '../tabs/services');
  };

  return (
    <ScrollView
      style={TAGS.body}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={TAGS.header}>
        <Text style={TEXTS.pageTitle}>Service Request Form</Text>
      </View>

      <View style={TAGS.form}>
        <SelectField label="Location" value={location} onChange={setLocation} options={locations} placeholder="Select location" />
        <SelectField label="Venue" value={venue} onChange={setVenue} options={venues} placeholder="Select venue" />
        <SelectField label="Nature" value={nature} onChange={setNature} placeholder="Select nature" options={[
          ['2', { name: 'Maintenance' }],
          ['3', { name: 'Clean Master' }],
        ]} />
        <TextAreaField label="Problem" value={problem} onChange={setProblem} onValidate={setProblemValid} placeholder="What's your concern?" />
        <SelectField label="Item" value={items} onChange={setItems} options={groups} placeholder="Select item" />

        <FileUpload
          label="Upload Related Image"
          file={imageFile}
          onPick={setImageFile}
          type='image'
        />

        <SubmitButton enabled={submitEnabled} onPress={handleSubmit} />
      </View>
      <View style={TAGS.spacer}></View>
    </ScrollView>
  );
}
