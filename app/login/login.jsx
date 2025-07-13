// /app/login/login.jsx

import { useEffect, useState } from "react";
import {
    Text,
    View,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    GoogleSignin,
    GoogleLogoButton,
} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";

import { TAGS, FORMS, TEXTS } from "@/lib/utils/theme";
import { COLORS, FONT_SIZES, STYLES } from "@/lib/utils/enums";




export default function LoginPage() {
    useEffect(() => {
        // Ideally move this to your app root
        // GoogleSignin.configure();
    }, []);


    const startSignInFlow = async () => {
        try {
            GoogleSignin.configure({
                webClientId: Constants.expoConfig.extra.GOOGLE_CLIENT_ID,
                offlineAccess: true, // Optional, only if you need a refresh token
            });

            await GoogleSignin.hasPlayServices();
            const signInResponse = await GoogleSignin.signIn();
            if (signInResponse.type === 'success') {
                // use signInResponse.data
                console.log("Google Sign-In Success", signInResponse.data);
            } else if (signInResponse.type === 'noSavedCredentialFound') {
                const createResponse = await GoogleSignin.createAccount();
                if (createResponse.type === 'success') {
                    console.log("Account Created", createResponse.data);
                } else if (createResponse.type === 'noSavedCredentialFound') {
                    const explicitResponse = await GoogleSignin.presentExplicitSignIn();
                    if (explicitResponse.type === 'success') {
                        console.log("Explicit Sign-In Success", explicitResponse.data);
                    }
                }
            }
        } catch (error) {
            console.error("Google Sign-In Error", error);
        }
    };

    return (
        <View style={[TAGS.body, styles.body]}>
            <View style={[TAGS.form, styles.container]}>
                <Image source={require("../../assets/emblem.png")} style={styles.icon} />
                <Text style={styles.text}>{"Welcome to"}</Text>
                <Image source={require("../../assets/logo.png")} style={styles.logo} />

                <TouchableOpacity
                    onPress={startSignInFlow}
                    style={[
                        TAGS.button,
                        FORMS.submit,
                        { backgroundColor: COLORS.primary },
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
