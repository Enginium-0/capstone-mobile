// app/forms/[rateService].jsx

import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';

import { SelectField, TextAreaField, SubmitButton } from '../../components/Form.jsx';
import { TAGS, TEXTS } from '../../lib/utils/theme.js';
import { getUser } from '../../lib/controllers/UserController.js';
import { getDepartment } from '../../lib/controllers/DepartmentController.js';
import { ratePersonnel } from '../../lib/controllers/RatingController.js';
import { COLORS } from '../../lib/utils/enums.js';
import { getServiceRequest, updateJobOrder } from '../../lib/controllers/ServiceController.js';
import { isSuccess } from '../../lib/utils/form.js';

export default function ServiceRatingForm() {
  const { rateService } = useLocalSearchParams();
  const [rating, setRating] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [valid, setValid] = useState(true);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [employee, setEmployee] = useState({});
  const [department, setDepartment] = useState({});

  useEffect(() => {
    (async () => {
      const request = await getServiceRequest(rateService);
      const user = await getUser(request.dispatched);
      setEmployee(user ?? {});
      const dept = await getDepartment(user.department);
      setDepartment(dept ?? {});
      
    })();

  }, [rateService]);

  useEffect(() => {
    setSubmitEnabled(rating && valid);
  }, [rating, recommendation, valid]);

  const handleSubmit = async () => {
    const success = await ratePersonnel( {employee, rating, recommendation});
    await updateJobOrder({id: rateService, rating: true});
    isSuccess(success, '/tabs/services');
  };

  return (
    <ScrollView style={TAGS.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={TAGS.form}>
        <View>
          <Text style={TEXTS.pageTitle}>Crew Performance Assessment</Text>
          <Text>Your request has been successfully completed. We’d love to hear your feedback!</Text>
        </View>

        <View>
          <Text style={[TEXTS.label, { paddingBottom: 0 }]}>
            {employee.name ?? 'No employee'}
          </Text>
          <Text style={{color: COLORS.gray}}>
            {department.name ?? 'No department'}
          </Text>
        </View>

        <SelectField
          label="How would you rate our service?"
          value={rating}
          onChange={setRating}
          options={['1', '2', '3', '4', '5'].map(v => [v, { name: v }])}
          placeholder="Select rating"
        />

        <TextAreaField
          label="Recommendations"
          value={recommendation}
          onChange={setRecommendation}
          onValidate={setValid}
        />

        <SubmitButton enabled={submitEnabled} onPress={handleSubmit} />
      </View>
      <View style={TAGS.spacer}></View>
    </ScrollView>
  );
}
