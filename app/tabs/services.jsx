// app/tabs/services.jsx

import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

// Developer's Library
import { TAGS, TEXTS } from '../../lib/utils/theme.js';
import CreateButton from '../../components/CreateButton';
import RequestOverview from '../../components/RequestOverview';
import { user } from '../../dev/temp.js';
import { getServiceRequests } from '../../lib/controllers/ServiceController.js';
import { getLocations } from '../../lib/controllers/LocationController.js';
import { getVenues } from '../../lib/controllers/VenueController.js';
import StatusFilter from '../../components/StatusFilter';

export default function Services() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [locations, setLocations] = useState({});
  const [venues, setVenues] = useState({});
  const [filterStatus, setFilterStatus] = useState(null);

  useEffect(() => {
    (async () => {
      const results = await getServiceRequests({ uid: user.uid, unrated: true });
      const filtered = results.filter(order => !order.rating);
      setOrders(filtered);

      const loc = await getLocations();
      const locMap = {};
      loc.forEach(l => (locMap[l.code] = l));
      setLocations(locMap);

      const ven = await getVenues();
      const venMap = {};
      ven.forEach(v => (venMap[v.code] = v));
      setVenues(venMap);
    })();
  }, []);

  useEffect(() => {
    ( async () => {
      if (filterStatus === null) {
        const all = await getServiceRequests({ uid: user.uid, unrated: false });
        setOrders(all);
      } else {
        const unrated = await getServiceRequests({ uid: user.uid, unrated: true });
        setOrders(unrated);
      }
    })();
  }, [filterStatus]);

  return (
    <View style={TAGS.body}>
      <View style={TAGS.header}>
        <Text style={TEXTS.pageTitle}>Services</Text>
        <CreateButton to="../service/service-form" />
      </View>
      <StatusFilter selected={filterStatus} onChange={setFilterStatus} />

      <FlatList
        data={orders.filter(order => filterStatus === null || order.status === filterStatus)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const locName = locations[item.location]?.name ?? item.location;
          const venueName = venues[item.venue]?.name ?? item.venue;

          const path = item.status === 2 && !item.rating
            ? `/service/rate/${item.id}`
            : `/service/${item.id}`;

          return (
            <RequestOverview
              title={`Request ${item.id}`}
              details={[
                `Location: ${locName} ${venueName}`,
                `Problem: ${item.problem}`,
              ]}
              status={item.status}
              timestamp={new Date(item.created).toLocaleString()}
              path={path}
            />
          );
        }}
      />
    </View>
  );
}
