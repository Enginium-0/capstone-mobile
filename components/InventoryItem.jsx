// components/InventoryItem
import { StyleSheet, View, Text } from "react-native";
import { COLORS, FONT_SIZES, STYLES } from "../lib/utils/enums";
import { TAGS } from "../lib/utils/theme";


export default function InventoryItem({group = 'Group Name', quantity = -1}) {
    return (
        <View style={styles.row}>
            <View style={styles.group}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.text,TAGS.flexItem]}>{group}</Text>
                <View style={styles.circle}>
                    <Text style={styles.quantity}>{quantity}</Text>
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
