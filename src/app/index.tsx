import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function Loading() {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <LottieView
                source={require("../../assets/animations/animation-one.json")}
                autoPlay
                loop={false}
                style={styles.animation}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    animation: {
        width: 300,
        height: 300,
    },
});
