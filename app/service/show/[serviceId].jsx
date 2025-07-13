// app/reservation/[serviceId].jsx

import { View, Text, ScrollView, Button, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { getReservationRequest, updateReservation } from '@/lib/controllers/ReservationController';
import { getUser } from '@/lib/controllers/UserController';
import { getLocation } from '@/lib/controllers/LocationController';
import { getVenue } from '@/lib/controllers/VenueController';
import { getEquipmentById } from '@/lib/controllers/EquipmentController';
import { getGroupByCode } from '@/lib/controllers/GroupController';
import { TAGS, TEXTS } from '@/lib/utils/theme';
import { downloadAndSaveFile } from '@/lib/utils/form';
import MessageButton from '@/components/MessageButton';

export default function ReservationOverview() {
  const { reservationId } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!reservationId) return;
      const reservation = await getReservationRequest(reservationId);
      if (!reservation?.id) return;

      const requestor = await getUser(reservation.requestor);
      const location = await getLocation(reservation.location);
      const venue = await getVenue(reservation.venue);

      const equipments = await Promise.all(
        (reservation.equipments ?? []).map(async (eid) => {
          const eq = await getEquipmentById(eid);
          const group = await getGroupByCode(eq?.group);
          return `${eq?.name} (${group?.name})`;
        })
      );

      const additionals = [];
      if (reservation.guard) additionals.push('Guard');
      if (reservation.crew) additionals.push('Crew');

      setData({
        ...reservation,
        requestorName: requestor?.name,
        locationName: location?.name,
        venueName: venue?.name,
        equipments,
        additionals,
      });
    })();
  }, [reservationId]);

  if (!data) return <Text>Loading...</Text>;

  const renderRow = (label, value) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={TEXTS.label}>{label}</Text>
      <Text>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={TAGS.body}>
      <View style={TAGS.header}>
        <Text style={TEXTS.pageTitle}>Reservation Overview</Text>
        <MessageButton to={`/conversation/${data.conversation}`} />
      </View>

      <View style={TAGS.form}>
        {renderRow('Status', statusText(data.status))}
        {renderRow('Requestor', data.requestorName)}
        {renderRow('Affiliation', data.affiliation)}
        {renderRow('Location', data.locationName)}
        {renderRow('Venue', data.venueName)}
        {renderRow('Ingress', `${data.ingressDate} ${data.ingressTime}`)}
        {renderRow('Egress', `${data.egressDate} ${data.egressTime}`)}
        {renderRow('Requested', new Date(data.created).toLocaleString())}

        {data.equipments?.length > 0 &&
          renderRow('Equipment', data.equipments.join(', '))}

        {data.additionals?.length > 0 &&
          renderRow('Additionals', data.additionals.join(', '))}

        {data.departments?.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={TEXTS.label}>Signatories</Text>
            {data.departments.map((dept, index) => (
              <Text key={index}>{dept.replace(/_/g, ' ')}</Text>
            ))}
          </View>
        )}

        <View style={{ gap: 10, marginBottom: 20 }}>
          <Text style={TEXTS.label}>Files</Text>
          <Button
            title="Download Activity Proposal"
            onPress={async () => {
              setIsProcessing(true);
              await downloadAndSaveFile(data.document, 'ActivityProposal.pdf');
              setIsProcessing(false);
            }}
            disabled={isProcessing}
          />
          <Button
            title="Open Floor Plan"
            onPress={() => Linking.openURL(data.image)}
            disabled={isProcessing}
          />
        </View>
      </View>

        {data.status === 1 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, paddingHorizontal: 10 }}>
            <Button
                title="Mark as Completed"
                onPress={async () => {
                    setIsProcessing(true);
                    await updateReservation({ id: data.id, status: 2 });
                    router.replace(`/reservation/rate/${data.id}`);
                }}
                disabled={isProcessing}
            />
            <Button
                title="Cancel Reservation"
                color="red"
                onPress={async () => {
                    setIsProcessing(true);
                    await updateReservation({ id: data.id, status: 3 });
                    router.replace(`/reservation/rate/${data.id}`);
                }}
                disabled={isProcessing}
            />
            </View>
        )}
        <View style={TAGS.spacer}></View>
    </ScrollView>
  );
}

function statusText(status) {
  switch (status) {
    case 0: return 'Pending';
    case 1: return 'Ongoing';
    case 2: return 'Completed';
    case 3: return 'Cancelled';
    default: return 'Unknown';
  }
}
