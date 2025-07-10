import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { getEquipments } from '../../lib/controllers/EquipmentController';
import { getGroups } from '../../lib/controllers/GroupController';
import InventoryItem from '../../components/InventoryItem';
import { TAGS, TEXTS } from '../../lib/utils/theme';

export default function Inventory() {
  const [groups, setGroups] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    async function load() {
      const loadedEquipment = await getEquipments({ byHidden: false });
      const relatedGroups = await getGroups({ byEquipments: loadedEquipment });

      console.log(JSON.stringify(loadedEquipment, null, 2));

      setEquipment(loadedEquipment);
      setGroups(relatedGroups);
    }

    load();
  }, []);

  return (
    <ScrollView style={TAGS.body}>
      <View style={TAGS.header}>
        <Text style={TEXTS.pageTitle}>Inventory</Text>
      </View>

      {groups.map(group => {
        const count = equipment.filter(eq => eq.group === group.code).length;
        return (
          <InventoryItem
            key={group.code}
            group={group.name}
            quantity={count}
          />
        );
      })}
    </ScrollView>
  );
}
