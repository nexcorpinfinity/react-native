import React from "react";
import {
    Modal,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
} from "react-native";

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ModalComponent({
    children,
    visible,
    onClose,
}: ModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContent}>{children}</View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    modalContent: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 20,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
