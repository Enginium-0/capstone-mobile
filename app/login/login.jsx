// // /app/login/login.jsx

// import { useEffect, useState } from "react";
// import {
//     Text,
//     TouchableOpacity,
//     View,
//     Image,
//     Alert,
//     ActivityIndicator,
// } from "react-native";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import * as WebBrowser from "expo-web-browser";
// // import * as AuthSession from "expo-auth-session";
// import { startAsync } from "expo-auth-session";


// import { auth, provider } from "@/lib/firebase";
// import { TAGS, FORMS, TEXTS } from "@/lib/utils/theme";
// import { COLORS, FONT_SIZES, STYLES } from "@/lib/utils/enums";

// // ✅ Required for Expo web auth session
// WebBrowser.maybeCompleteAuthSession();

// const discovery = {
//     authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
//     tokenEndpoint: "https://oauth2.googleapis.com/token",
// };

// export default function LoginPage() {
//     const [pressed, setPressed] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const handleLogin = async () => {
//         setPressed(true);
//         setLoading(true);

//         try {
//             const redirectUri = "https://auth.expo.io/@enginium_0/capstone-mobile"; // ✅ must be added in Firebase
//             const result = await startAsync({
//                 authUrl:
//                     `https://accounts.google.com/o/oauth2/v2/auth` +
//                     `?client_id=729894555819-tg42iiean55k86lccslp9nkp9ckensdf.apps.googleusercontent.com` +
//                     `&redirect_uri=${encodeURIComponent("https://auth.expo.io/@enginium_0/capstone-mobile")}` +
//                     `&response_type=token` +
//                     `&scope=profile email`,
//             });


//             if (result.type === "success" && result.params.access_token) {
//                 const credential = GoogleAuthProvider.credential(null, result.params.access_token);
//                 const userCredential = await signInWithCredential(auth, credential);
//                 const { email, displayName, uid } = userCredential.user;

//                 console.log("✅ Login Success:", { email, displayName, uid });
//             } else {
//                 Alert.alert("Login Cancelled");
//             }
//         } catch (error) {
//             console.error("❌ Login Error:", error.message);
//             Alert.alert("Login Failed", error.message);
//             setPressed(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
//     }

//     return (
//         <View style={[TAGS.body, styles.body]}>
//             <View style={[TAGS.form, styles.container]}>
//                 <Image source={require("../../assets/emblem.png")} style={styles.icon} />
//                 <Text style={styles.text}>{"Welcome to"}</Text>
//                 <Image source={require("../../assets/logo.png")} style={styles.logo} />

//                 <TouchableOpacity
//                     disabled={pressed}
//                     onPress={handleLogin}
//                     style={[
//                         TAGS.button,
//                         FORMS.submit,
//                         {
//                             backgroundColor: !pressed ? COLORS.primary : COLORS.disabled,
//                         },
//                     ]}
//                 >
//                     <Text style={[TEXTS.button, styles.button]}>{"Login"}</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// const styles = {
//     body: {
//         justifyContent: "center",
//         alignItems: "center",
//         flex: 1,
//     },
//     container: {
//         width: 288,
//         borderWidth: 2,
//         borderColor: COLORS.placeholder,
//         borderStyle: "solid",
//         gap: 0,
//         alignItems: "center",
//         flexGrow: 0,
//         padding: STYLES.PADDING,
//     },
//     icon: {
//         width: 50,
//         height: 50,
//         marginBottom: 4,
//     },
//     logo: {
//         width: 256,
//         height: 29,
//         resizeMode: "contain",
//         marginBottom: STYLES.PADDING,
//     },
//     button: {
//         fontSize: FONT_SIZES.large,
//         width: 200,
//         textAlign: "center",
//     },
//     text: {
//         fontSize: 18,
//     },
// };
