// components/DashboardItem

import { StyleSheet, View, Text } from "react-native";
import { COLORS, FONT_SIZES, STYLES } from "../lib/utils/enums";
import { getColor, TAGS, TEXTS } from "../lib/utils/theme";
import { Ionicons } from "@expo/vector-icons";

function textStatus(status, quantity) {
    let label;
    let color;

    if (!status && status !== 0) {
        label = quantity;
        color = 'black';
    } else {
        color = getColor({byStatus: status});
        label = (() => {
            switch (status) {
                case 0: return 'Pending';
                case 1: return 'Ongoing';
                case 2: return 'Completed';
                case 3: return 'Cancelled';
                default: return 'None';
            }
        })();   
    }

    return (
        <Text style={[TEXTS.label, {color: color}]}>{label}</Text>
    );
}

export default function DashboardItem({label, status, quantity, icon = ''}) {
    return (
        <View style={styles.row}>
            <View style={styles.group}>
                <View>
                    <Text style={TEXTS.placeholder}>{label}</Text>
                    {textStatus(status, quantity)}
                </View>
                <View style={styles.circle}>
                    <Ionicons name={icon} size={24} color="white" />
                </View>
            </View>
        </View>
    );
}

const diameter = 42;
const styles = StyleSheet.create({
    row: {
        width: '100%',
        marginBottom: STYLES.GAP,
    },
    group: {
        backgroundColor: 'white',
        borderRadius: STYLES.BORDER_RADIUS,
        padding: STYLES.PADDING,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: STYLES.BORDER_WIDTH,
        borderColor: COLORS.brownLight,
    },
    text: {
        fontSize: FONT_SIZES.large,
        fontWeight: '500',
        marginRight: 12,
    },
    circle: {
        width: diameter,
        height: diameter,
        backgroundColor: COLORS.brownLight,
        borderRadius: diameter/2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity: {
        color: 'white',
        fontSize: FONT_SIZES.xxlarge,
    }
})
