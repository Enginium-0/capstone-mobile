// app/reservation/[rateReservation].jsx

import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';

import { SelectField, TextAreaField, SubmitButton } from '@/components/Form.jsx';
import { TAGS, TEXTS } from '@/lib/utils/theme.js';
import { COLORS } from '@/lib/utils/enums.js';
import { isSuccess } from '@/lib/utils/form.js';
import { getVenue } from '@/lib/controllers/VenueController.js';
import { getLocation } from '@/lib/controllers/LocationController.js';
import { getReservationRequest, updateReservation } from '@/lib/controllers/ReservationController.js';
import { rateVenue } from '@/lib/controllers/RatingController.js';

export default function ReservationRatingForm() {
  const { rateReservation } = useLocalSearchParams();
  const [rating, setRating] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [valid, setValid] = useState(true);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [venue, setVenue] = useState({});
  const [location, setLocation] = useState({});

  useEffect(() => {
    (async () => {
        try {
            const request = await getReservationRequest(rateReservation);
            const area = await getVenue(request.venue);
            setVenue(area);
            const loc = await getLocation(request.location);
            setLocation(loc);
        } catch (err) {
            console.err("ayaw nanaman!!!", err);
        }
    })();

  }, [rateReservation]);

  useEffect(() => {
    setSubmitEnabled(rating && valid);
  }, [rating, recommendation, valid]);

  const handleSubmit = async () => {
    try {
        console.log("venue:", venue);
        const success = await rateVenue( {venue, rating, recommendation});
        await updateReservation({id: rateReservation, rating: true});
        isSuccess(success, '/tabs/reservations');
    } catch (err) {
        console.error("wag kung ayaw!", err);
    }
  };

  return (
    <ScrollView style={TAGS.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={TAGS.form}>
        <View>
          <Text style={TEXTS.pageTitle}>Reservation Service Evaluation</Text>
          <Text>Your request has been successfully completed. We’d love to hear your feedback!</Text>
        </View>

        <View>
          <Text style={[TEXTS.label, { paddingBottom: 0 }]}>
            {venue.name ?? 'No venue'}
          </Text>
          <Text style={{color: COLORS.gray}}>
            {location.name ?? 'No location'}
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
