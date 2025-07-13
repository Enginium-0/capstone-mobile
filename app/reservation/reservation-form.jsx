// app/reservation/reservation-form.jsx

import { ScrollView, View, Text } from "react-native";
import { useEffect, useState } from "react";

import { SelectField, TextAreaField, SelectFarm, FileUpload, SubmitButton } from "@/components/Form";
import { getLocations } from "@/lib/controllers/LocationController";
import { getVenues } from "@/lib/controllers/VenueController";
import { COLORS } from "@/lib/utils/enums";
import { TAGS, TEXTS } from "@/lib/utils/theme";
import { getIngressTimes, getEgressTimes } from "@/lib/controllers/DateController";
import { DateInput } from '@/components/Chronos';
import { postReservationRequest, getAvailableEquipments } from "@/lib/controllers/ReservationController";
import { isSuccess } from "@/lib/utils/form";

export default function ReservationForm() {
  const [activityName, setActivityName] = useState('');
  const [validName, setValidName] = useState(true);
  const [affiliation, setAffiliation] = useState('');
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [venues, setVenues] = useState([]);
  const [venue, setVenue] = useState('');
  const [guard, setGuard] = useState(false);
  const [crew, setCrew] = useState(false);
  const [document, setDocument] = useState(null);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [egressDate, setEgressDate] = useState(null);
  const [ingressDate, setIngressDate] = useState(null);
  const [egressTimes, setEgressTimes] = useState([]);
  const [ingressTimes, setIngressTimes] = useState([]);
  const [egressTime, setEgressTime] = useState('');
  const [ingressTime, setIngressTime] = useState('');
  const [floorPlan, setFloorPlan] = useState(null);
  const [onhold, setOnHold] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const locs = await getLocations({ hideDefault: true });
        setLocations(locs.map(loc => [loc.code, loc]));
      } catch (err) {
        console.error("❌ Error fetching locations:", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!location) {
        setVenues([]);
        setIngressTimes([]);
        setIngressDate(null);
        setEgressTimes([]);
        setEgressDate(null);
        setAvailableEquipments([]);
        return;
      }
      try {
        const vens = await getVenues({ byLocation: location });
        setVenues(vens.map(venue => [venue.code, venue]));
      } catch (err) {
        console.error("❌ Error fetching venues:", err);
      }
    })();
  }, [location]);

  useEffect(() => {
    ( async () => {
        
        if (!ingressDate) {
            setIngressTimes([]);
            setEgressDate(null);
            setEgressTimes([]);
            return;
        }
        try {
            const inTimes = await getIngressTimes({ location, venue, ingressDate });
            setIngressTimes(inTimes.map(t => [String(t.h), { name: t.name }]));

        } catch (err) {
            console.error('❌ Failed to fetch ingressTimes:', err);
        }
    })();
  }, [location, venue, ingressDate]);

  useEffect(() => {
    ( async () => {
            console.log("egress");
        if (!egressDate) {
            setEgressTimes([]);
            return;
        }
        try {
            const outTimes = await getEgressTimes({ location, venue, ingressDate, ingressTime, egressDate });
            setEgressTimes(outTimes.map(t =>  [String(t.h), { name: t.name }]));

        } catch (err) {
            console.error('❌ Failed to fetch EgressTimes:', err);
        }
        })();
  }, [location, venue, ingressDate, ingressTime, egressDate]);

  useEffect(() => {
    (async () => {
      try {
        const available = await getAvailableEquipments({ ingressDate, ingressTime, egressDate, egressTime });
        setAvailableEquipments(available.map(item => [item.id, item]));
      } catch (err) {
        console.error("❌ Error fetching equipments:", err);
      }
    })();
  }, [ingressDate, ingressTime, egressDate, egressTime]);

    // At the top with other state declarations
const [formValid, setFormValid] = useState(false);

// useEffect to update formValid whenever any dependency changes
useEffect(() => {
    setFormValid(
        activityName.trim() &&
        validName &&
        affiliation &&
        location &&
        venue &&
        ingressDate &&
        egressDate &&
        typeof ingressTime === 'string' &&
        typeof egressTime === 'string' &&
        ingressTime.trim() &&
        egressTime.trim() &&
        document &&
        floorPlan && 
        !onhold
    );
    const formCheck = {
        activityName: activityName.trim().length > 0,
        validName,
        affiliation: Boolean(affiliation),
        location: Boolean(location),
        venue: Boolean(venue),
        ingressDate: Boolean(ingressDate),
        egressDate: Boolean(egressDate),
        ingressTime: typeof ingressTime === 'string' && ingressTime.trim().length > 0,
        egressTime: typeof egressTime === 'string' && egressTime.trim().length > 0,
        document: Boolean(document),
        floorPlan: Boolean(floorPlan),
        onhold: !onhold, // because form is valid only if !onhold
    };
    console.log(formCheck.egressTime);
    console.log(egressTime);
    console.log("🧪 Form check:", JSON.stringify(formCheck, null, 2));

    }, [
    activityName, validName, affiliation, location, venue,
    ingressDate, egressDate, ingressTime, egressTime,
    document, floorPlan, onhold
]);


  const handleSubmit = async () => {
    setOnHold(true);

    const request = {
      name: activityName,
      affiliation,
      ingressDate: ingressDate?.toISOString().split("T")[0],
      ingressTime,
      egressDate: egressDate?.toISOString().split("T")[0],
      egressTime,
      location,
      venue,
      equipments,
      ap: document,
      fp: floorPlan,
      guard,
      crew,
    };

    try {
      const success = await postReservationRequest({ request });
      isSuccess(success, '/tabs/reservations');
    } catch (err) {
      console.error("❌ Failed to post reservation:", err);
    }
  };

  return (
    <ScrollView style={TAGS.body}>
      <View style={TAGS.header}>
        <Text style={TEXTS.pageTitle}>Reservation Request Form</Text>
      </View>
      <View style={TAGS.form}>
        <TextAreaField label="Activity Name" value={activityName} onChange={setActivityName} onValidate={setValidName} placeholder="Activity Name" />
        <SelectField label="Participants" value={affiliation} onChange={setAffiliation} options={[["External", { name: "External" }], ["Internal", { name: "Internal" }]]} />
        <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
        <SelectField label="Venue" value={venue} onChange={setVenue} options={venues} />
        <DateInput label="Ingress Date" value={ingressDate} onChange={setIngressDate} />
        <SelectField label="Ingress Time" value={ingressTime} onChange={setIngressTime} options={ingressTimes} />
        <Text style={TEXTS.placeholder}>If no Egress Time is available, it means there's a next event. Please choose an earlier date.</Text>
        <DateInput label="Egress Date" value={egressDate} onChange={setEgressDate} minimum={ingressDate} />
        <SelectField label="Egress Time" value={egressTime} onChange={setEgressTime} options={egressTimes} />
        <SelectFarm label="Equipment" value={equipments} onChange={setEquipments} options={availableEquipments} repeatable={false} />
        <FileUpload label="Attach AP" file={document} onPick={setDocument} type="pdf" />
        <FileUpload label="Floor Plan" file={floorPlan} onPick={setFloorPlan} type="image" />
        <Text style={{ color: COLORS.red, fontStyle: 'italic' }}>* Additional manpower is subject to additional fee.</Text>
        <SelectField label="Add Security Guard" value={guard} onChange={setGuard} options={[[true, { name: "Yes" }], [false, { name: "No" }]]} />
        <SelectField label="Add Service Crew" value={crew} onChange={setCrew} options={[[true, { name: "Yes" }], [false, { name: "No" }]]} />
        <SubmitButton enabled={!!formValid} onPress={handleSubmit} />
      </View>
      <View style={TAGS.spacer}></View>
    </ScrollView>
  );
}


// // app/reservation/reservation-form.jsx

// import { ScrollView, View, Text } from "react-native";
// import { useEffect, useState } from "react";

// import { SelectField, TextAreaField, SelectFarm, FileUpload, SubmitButton } from "../../components/Form";
// import { getLocations } from "../../lib/controllers/LocationController";
// import { getVenues } from "../../lib/controllers/VenueController";
// import { COLORS } from "../../lib/utils/enums";
// import { TAGS, TEXTS } from "../../lib/utils/theme";
// import { getIngressTimes, getEgressTimes } from "../../lib/controllers/DateController";
// import { DateInput } from '../../components/Chronos';
// import { postReservationRequest, getAvailableEquipments } from "../../lib/controllers/ReservationController";
// import { isSuccess } from "../../lib/utils/form";


// export default function ReservationForm() {
//   const [activityName, setActivityName] = useState('');
//   const [validName, setValidName] = useState(true);
//   const [affiliation, setAffiliation] = useState('');
//   const [locations, setLocations] = useState([]);
//   const [location, setLocation] = useState('');
//   const [venues, setVenues] = useState([]);
//   const [venue, setVenue] = useState('');
//   const [guard, setGuard] = useState(false);
//   const [crew, setCrew] = useState(false);
//   const [document, setDocument] = useState(null);
//   const [availableEquipments, setAvailableEquipments] = useState([]);
//   const [equipments, setEquipments] = useState([]);
//   const [egressDate, setEgressDate] = useState(null);
//   const [ingressDate, setIngressDate] = useState(null);
//   const [egressTimes, setEgressTimes] = useState([]);
//   const [ingressTimes, setIngressTimes] = useState([]);
//   const [egressTime, setEgressTime] = useState('');
//   const [ingressTime, setIngressTime] = useState('');
//   const [floorPlan, setFloorPlan] = useState(null);
//   const [onhold, setOnHold] = useState(false);

//     useEffect(() => {
//         (async () => {
//         const locs = await getLocations({ hideDefault: true });
//         setLocations(locs.map(loc => [loc.code, loc]));
//         })();
//     }, []);

//     // Venues
//     useEffect(() => {
//         (async () => {
//         if (!location) {
//             setVenues([]);
//             setIngressTimes([]);
//             setEgressTimes([]);
//             setAvailableEquipments([]);
//         }
//         const vens = await getVenues({ byLocation: location });
//         setVenues(vens.map(venue => [venue.code, venue]));
//         })();
//     }, [location]);



//     // Ingress Times
//     useEffect(() => {
//         const fetchIngressTimes = async () => {
//             if (!ingressDate) {
//                 setIngressTimes([]);
//                 setEgressTimes([]);
//                 return;
//             }

//             try {
//                 const inTimes = await getIngressTimes({location, venue, ingressDate});
//                 setIngressTimes(inTimes);
//             } catch (err) {
//                 console.error('❌ Failed to fetch ingressTimes:', err);
//             }
//         };

//         fetchIngressTimes();
//     }, [location, venue, ingressDate]);

//     //Egress Time
//     useEffect(() => {
//         const fetchEgressTimes = async () => {
//             if (!egressDate) {
//                 setEgressTimes([]);
//                 return;
//             }
//             try {
//                 const outTimes = await getEgressTimes({location, venue, ingressDate, ingressTime, egressDate});
//                 setEgressTimes(outTimes);
//             } catch (err) {
//                 console.error('❌ Failed to fetch EgressTimes:', err);
//             }
//         };

//         fetchEgressTimes();
//     }, [location, venue, ingressDate, ingressTime, egressDate]);

//     // Available Equipments
//     useEffect(() => {
//         (async () => {
//         try {
//             const available = await getAvailableEquipments({ ingressDate, ingressTime, egressDate, egressTime });
//             setAvailableEquipments(available.map(item => [item.id, item]));
//         } catch (err) {
//             console.error("Mah asan?", err);
//         }
//         })();
//     }, [ingressDate, ingressTime, egressDate, egressTime]);

//   const formValid = (
//     activityName.trim() &&
//     validName &&
//     affiliation &&
//     location &&
//     venue &&
//     ingressDate &&
//     egressDate &&
//     typeof ingressTime === 'string' &&
//     typeof egressTime === 'string' &&
//     ingressTime.trim() &&
//     egressTime.trim() &&
//     document &&
//     floorPlan && 
//     !onhold
//   );

//     const handleSubmit = async () => {
        
//         setOnHold(true);
//         const request = {
//         name: activityName,
//         affiliation,
//         ingressDate: ingressDate?.toISOString().split("T")[0], // e.g. "2025-06-18"
//         ingressTime,
//         egressDate: egressDate?.toISOString().split("T")[0],
//         egressTime,
//         location,
//         venue,
//         equipments,
//         ap: document,
//         fp: floorPlan,
//         guard,
//         crew,
//         }

//         try {    
//         const success = await postReservationRequest({request: request});
//         isSuccess(success, '/tabs/reservations');
//         } catch (err) {
//         console.error("Posting reservation request failed:", err);
//         }
//     };

//   return (
//     <ScrollView style={TAGS.body}>
//       <View style={TAGS.header}>
//         <Text style={TEXTS.pageTitle}>Reservation Request Form</Text>
//       </View>
//       <View style={TAGS.form}>
//         <TextAreaField label="Activity Name" value={activityName} onChange={setActivityName} onValidate={setValidName} placeholder="Activity Name" />
//         <SelectField label="Participants" value={affiliation} onChange={setAffiliation} options={[
//           ['External', { name: 'External' }],
//           ['Internal', { name: 'Internal' }],
//         ]} />
//         <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
//         <SelectField label="Venue" value={venue} onChange={setVenue} options={venues} />
//         <DateInput label="Ingress Date" value={ingressDate} onChange={setIngressDate} />
//         <SelectField label="Ingress Time" value={ingressTime} onChange={setIngressTime} options={ingressTimes}/>
//         <Text style={TEXTS.placeholder}>If no Egress Time is available, it means there's a next event. Please choose an earlier date.</Text>
//         <DateInput
//           label="Egress Date"
//           value={egressDate}
//           onChange={setEgressDate}
//           minimum={ingressDate}
//         />
//         <SelectField label="Egress Time" value={egressTime} onChange={setEgressTime} options={egressTimes}/>
//         <SelectFarm label="Equipment" value={equipments} onChange={setEquipments} options={availableEquipments} repeatable={false} />
//         <FileUpload
//           label="Attach AP"
//           file={document}
//           onPick={setDocument}
//           type="pdf"
//         />
//         <FileUpload label="Floor Plan" file={floorPlan} onPick={setFloorPlan} type="image" />
//         <Text style={{ color: COLORS.red, fontStyle: 'italic' }}>
//           * Additional manpower is subject to additional fee.
//         </Text>
//         <SelectField label="Add Security Guard" value={guard} onChange={setGuard} options={[
//           [true, { name: "Yes" }],
//           [false, { name: "No" }],
//         ]} />
//         <SelectField label="Add Service Crew" value={crew} onChange={setCrew} options={[
//           [true, { name: "Yes" }],
//           [false, { name: "No" }],
//         ]} />
//         <SubmitButton enabled={!!formValid} onPress={handleSubmit} />
//       </View>
//       <View style={TAGS.spacer}></View>
//     </ScrollView>
//   );
// }
