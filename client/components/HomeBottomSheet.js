import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';

const { height } = Dimensions.get('window');

export default function HomeBottomSheet({ user, theme }) {
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const newHeight = height - gestureState.moveY;
                if (newHeight <= height && newHeight >= 0) {
                    animation.setValue(gestureState.moveY / height);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 50) {
                    closeSheet();
                } else {
                    openSheet();
                }
            },
        })
    ).current;

    const openSheet = () => {
        Animated.spring(animation, {
            toValue: 1,
            useNativeDriver: true,
        }).start(() => setIsOpen(true));
    };

    const closeSheet = () => {
        Animated.spring(animation, {
            toValue: 0,
            useNativeDriver: true,
        }).start(() => setIsOpen(false));
    };

    const interpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [height - 430, 80],
    });

    const animatedStyle = {
        transform: [{ translateY: interpolate }],
    };

    return (
        <View style={styles.container}>
            <Animated.View
                {...panResponder.panHandlers}
                style={[animatedStyle, styles.sheet, { backgroundColor: theme.btnTab }]}
            >
                <View style={styles.sheetHandle} />
                <Text>This is a bottom sheet</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        width: "100%",
        flex: 1
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height,
    },
    sheetHandle: {
        width: 60,
        height: 6,
        backgroundColor: '#ccc',
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: 10,
    },
});
