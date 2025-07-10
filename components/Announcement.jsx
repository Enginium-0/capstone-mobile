// /components/Announcement.jsx

import { Image, Text, View } from "react-native";
import { TAGS, TEXTS } from "../lib/utils/theme";
import { useEffect } from "react";

export default function Announcement({announcement}) {
    return (
        <View style={TAGS.form}>
            <Image
                source={{ uri: announcement.image }}
                style={{ width: '100%', height: 200 }}
                resizeMode="contain"
            />
            <View>
                <Text style={TEXTS.label}>{announcement.title}</Text>
                <Text>{announcement.message}</Text>
            </View>
        </View>
    );
}