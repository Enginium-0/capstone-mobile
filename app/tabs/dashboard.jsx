// app/tabs/dashboard.jsx
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native'; 
import { View, Text, ScrollView } from 'react-native';
import { TAGS, TEXTS } from '../../lib/utils/theme';
import { useEffect, useState } from 'react';
import { getLatestAnnouncement } from "../../lib/controllers/AnnouncementController";
import Announcement from '../../components/Announcement';
import DashboardItem from '../../components/DashboardItem';
import { STYLES } from '../../lib/utils/enums';
import { user } from '../../dev/temp.js';
import { getLastReservation, getReservationRequests, getVenueReservationStats } from "../../lib/controllers/ReservationController.js";
import { getLastServiceRequest, getServiceRequests } from "../../lib/controllers/ServiceController.js";

export default function Dashboard() {
  const [announcement, setAnnouncement] = useState(null);
  const [reservation, setReservation] = useState(-1);
  const [reservations, setReservations] = useState(0);
  const [service, setService] = useState(-1);
  const [services, setServices] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const [venueStats, setVenueStats] = useState([]);

  useEffect(() => {
    async function load() {
      const ann = await getLatestAnnouncement();
      setAnnouncement(ann);

      const lastReservation = await getLastReservation(user.uid);
      setReservation(lastReservation.status);

      const allReservations = await getReservationRequests({uid: user.uid});
      setReservations(allReservations.length);

      const lastService = await getLastServiceRequest({uid: user.uid});
      setService(lastService.status);
      console.log(service);

      const allServices = await getServiceRequests({uid: user.uid});
      setServices(allServices.length);
  
      const stats = await getVenueReservationStats({ uid: user.uid });
      setVenueStats(stats);
    };

    load();
  }, []);

  return (
    <ScrollView style={TAGS.body}>
      <View style={TAGS.header}>
        <Text style={TEXTS.pageTitle}>Dashboard</Text>
      </View>
      { announcement && <Announcement announcement={announcement}/> }
      <DashboardItem label='Last Reservation' status={reservation} icon='today-outline'/>
      <DashboardItem label='Total Reservations' quantity={reservations} icon='calendar-outline'/>
      <DashboardItem label='Last Service' status={service} icon='document-outline'/>
      <DashboardItem label='Total Services' quantity={services} icon='documents-outline'/>
      {venueStats.length > 0 && (
        <View style={TAGS.form}>
          <Text style={TEXTS.label}>Venue Usage</Text>
          <PieChart
            data={venueStats}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              color: () => `rgba(0, 0, 0, 0.6)`,
              labelColor: () => '#000',
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="16"
            center={[0, 0]}
            absolute
          />
        </View>
      )}

      <View style={TAGS.spacer}></View> 
    </ScrollView>
  );
}

