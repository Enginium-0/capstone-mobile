// /app/login/login.jsx

import { useEffect, useState } from "react";
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useAuthRequest, Google } from "expo-auth-session/providers/google";
import { makeRedirectUri, ResponseType } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";


import { TAGS, FORMS, TEXTS } from "@/lib/utils/theme";
import { COLORS, FONT_SIZES, STYLES } from "@/lib/utils/enums";

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
    const [pressed, setPressed] = useState(false);
    const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = useAuthRequest({
        clientId: "729894555819-tg42iiean55k86lccslp9nkp9ckensdf.apps.googleusercontent.com",
        expoClientId: "729894555819-tg42iiean55k86lccslp9nkp9ckensdf.apps.googleusercontent.com",
        responseType: ResponseType.Token,
        scopes: ["profile", "email"],
        redirectUri: makeRedirectUri({
            useProxy: true,
        }),
    });

    console.log(makeRedirectUri({
        useProxy: true,}));
    useEffect(() => {
        const authenticate = async () => {
        if (response?.type === "success" && response.authentication?.accessToken) {
            try {
                setLoading(true);
                const credential = GoogleAuthProvider.credential(null, response.authentication.accessToken);
                const userCredential = await signInWithCredential(auth, credential);
                const { email, displayName, uid } = userCredential.user;
                console.log("✅ Login Success:", { email, displayName, uid });
            } catch (err) {
                console.error("❌ Firebase Auth Error:", err.message);
                Alert.alert("Login Failed", err.message);
            } finally {
            setLoading(false);
            }
        }
        };

        authenticate();
    }, [response]);

    const handleLogin = () => {
        setPressed(true);
        promptAsync().catch((error) => {
        console.error("❌ Auth Prompt Error:", error.message);
        Alert.alert("Login Error", error.message);
        setPressed(false);
        });
    };
    
    return (
        <View style={[TAGS.body, styles.body]}>
            <View style={[TAGS.form, styles.container]}>
                <Image source={require("../../assets/emblem.png")} style={styles.icon} />
                <Text style={styles.text}>{"Welcome to"}</Text>
                <Image source={require("../../assets/logo.png")} style={styles.logo} />

                <TouchableOpacity
                    disabled={!request || pressed}
                    onPress={handleLogin}
                    style={[
                        TAGS.button,
                        FORMS.submit,
                        { backgroundColor: !pressed ? COLORS.primary : COLORS.disabled },
                    ]}
                >
                    <Text style={[TEXTS.button, styles.button]}>{"Login"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = {
    body: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    container: {
        width: 288,
        borderWidth: 2,
        borderColor: COLORS.placeholder,
        borderStyle: "solid",
        gap: 0,
        alignItems: "center",
        flexGrow: 0,
        padding: STYLES.PADDING,
    },
    icon: {
        width: 50,
        height: 50,
        marginBottom: 4,
    },
    logo: {
        width: 256,
        height: 29,
        resizeMode: "contain",
        marginBottom: STYLES.PADDING,
    },
    button: {
        fontSize: FONT_SIZES.large,
        width: 200,
        textAlign: "center",
    },
    text: {
        fontSize: 18,
    },
};
