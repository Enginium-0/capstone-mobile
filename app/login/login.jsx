// /app/login/login.jsx

import { useEffect, useState } from "react";
import {
    Text,
    View,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Alert
} from "react-native";
import {
    GoogleSignin,
    GoogleLogoButton,
} from "@react-native-google-signin/google-signin";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import Constants from "expo-constants";

import { TAGS, FORMS, TEXTS } from "@/lib/utils/theme";
import { COLORS, FONT_SIZES, STYLES } from "@/lib/utils/enums";


export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Ideally move this to your app root
        GoogleSignin.configure({
            webClientId: Constants.expoConfig.extra.GOOGLE_CLIENT_ID,// from Firebase → Web client ID
            scopes: ['email', 'profile', 'openid'], // ✅ these are required
            offlineAccess: true, // Optional, only if you need a refresh token
        });
    }, []);

    const startSignInFlow = async () => {
        setIsLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const signInResponse = await GoogleSignin.signIn();
            
            console.log("Signed in:", signInResponse.data); // ✅ Fixed: use signInResponse.data instead of userInfo
            
            if (signInResponse.type === 'success') {
                // ✅ Connect to Firebase Auth
                const { idToken } = signInResponse.data;
                const credential = GoogleAuthProvider.credential(idToken);
                
                // Sign in to Firebase with Google credential
                const firebaseResult = await signInWithCredential(auth, credential);
                console.log("Firebase Auth Success:", firebaseResult.user);
                
                // Navigate to main app
                router.replace("/tabs/dashboard");
                
            } else if (signInResponse.type === 'noSavedCredentialFound') {
                const createResponse = await GoogleSignin.createAccount();
                if (createResponse.type === 'success') {
                    console.log("Account Created", createResponse.data);
                    // Handle account creation success
                    const { idToken } = createResponse.data;
                    const credential = GoogleAuthProvider.credential(idToken);
                    const firebaseResult = await signInWithCredential(auth, credential);
                    console.log("Firebase Auth Success:", firebaseResult.user);
                    router.replace("/tabs/dashboard");
                } else if (createResponse.type === 'noSavedCredentialFound') {
                    const explicitResponse = await GoogleSignin.presentExplicitSignIn();
                    if (explicitResponse.type === 'success') {
                        console.log("Explicit Sign-In Success", explicitResponse.data);
                        const { idToken } = explicitResponse.data;
                        const credential = GoogleAuthProvider.credential(idToken);
                        const firebaseResult = await signInWithCredential(auth, credential);
                        console.log("Firebase Auth Success:", firebaseResult.user);
                        router.replace("/tabs/dashboard");
                    }
                }
            }
        } catch (error) {
            console.error("Google Sign-In Error", error);
            Alert.alert("Sign In Error", "Failed to sign in. Please try again.");
        } finally {
            setIsLoading(false);
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
                    disabled={isLoading}
                    style={[
                        TAGS.button,
                        FORMS.submit,
                        { backgroundColor: isLoading ? COLORS.placeholder : COLORS.primary },
                    ]}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={[TEXTS.button, styles.button]}>{"Login"}</Text>
                    )}
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
