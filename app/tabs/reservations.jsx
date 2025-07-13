// app/tabs/reservation.jsx

import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

import { TAGS, TEXTS } from '../../lib/utils/theme.js';
import CreateButton from '../../components/CreateButton.jsx';
import RequestOverview from '../../components/RequestOverview.jsx';
import StatusFilter from '../../components/StatusFilter.jsx';

import { user } from '../../dev/temp.js';
import { getReservationRequests } from '../../lib/controllers/ReservationController.js';
import { getLocations } from '../../lib/controllers/LocationController.js';
import { getVenues } from '../../lib/controllers/VenueController.js';

export default function Reservations() {
const [reservations, setReservations] = useState([]);
const [locations, setLocations] = useState({});
const [venues, setVenues] = useState({});
const [filterStatus, setFilterStatus] = useState(null);

useEffect(() => {
    (async () => {
    const results = await getReservationRequests({ uid: user.uid, unrated: true });
    setReservations(results);

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
        const all = await getReservationRequests({ uid: user.uid, unrated: false });
        setReservations(all);
        } else {
        const unrated = await getReservationRequests({ uid: user.uid, unrated: true });
        setReservations(unrated);
        }
    })();
    }, [filterStatus]);

return (
    <View style={TAGS.body}>
    <View style={TAGS.header}>
        <Text style={TEXTS.pageTitle}>Reservations</Text>
        <CreateButton to="../reservation/reservation-form" />
    </View>

    <StatusFilter selected={filterStatus} onChange={setFilterStatus} />

    <FlatList
        data={reservations.filter(order => filterStatus === null || order.status === filterStatus)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
            const locName = locations[item.location]?.name ?? item.location;
            const venueName = venues[item.venue]?.name ?? item.venue;

            const path = item.status === 2 && !item.rating ? `/reservation/rate/${item.id}` :
                         `/reservation/show/${item.id}`;
            return (
                <RequestOverview
                title={`${item.name}`}
                details={[
                    `Reservation: ${item.id}`,
                    `Location: ${locName} ${venueName}`,
                    `Date: ${new Date(item.ingressDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}, ${item.ingressTime}:00`
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
