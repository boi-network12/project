import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import creditCardType from "credit-card-type";

export default function SaveCardInputs({ theme, onClose, setCardDetails, saveCard }) {
    const [loading, setLoading] = useState(false);
    const [cardType, setCardType] = useState(null);

    // Function to handle card number input
    const handleCard = (key, value) => {
        const cardInfo = creditCardType(value);
        const detectedCardType = cardInfo.length > 0 ? cardInfo[0].niceType : null;

        setCardType(detectedCardType);
        setCardDetails(prevState => ({
            ...prevState,
            cardType: detectedCardType,
            [key]: value,
        }));
    };

    // Function to handle input changes for card holder, CVV, and expiration date
    const handleInputChange = (key, value) => {
        setCardDetails(prevState => ({
            ...prevState,
            [key]: value
        }));
    };
    
    
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header]}>
                <TouchableOpacity onPress={onClose}>
                    <MaterialIcons name='keyboard-backspace' size={hp(3)} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.text, { color: theme.text }]}>Add Card</Text>
            </View>

            <View style={styles.form}>
                <Text style={[styles.label, { color: theme.text }]}>Card Holder</Text>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                    placeholderTextColor={theme.clickBackGround}
                    placeholder='Card Holder'
                    onChangeText={text => handleInputChange('cardHolder', text)}
                />

                <Text style={[styles.label, { color: theme.text }]}>Card Number</Text>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                    placeholderTextColor={theme.clickBackGround}
                    placeholder='Card Number'
                    onChangeText={text => handleCard('cardNumber', text)}
                />
                {cardType && <Text style={[styles.label, { color: theme.text }]}>Card Type: {cardType}</Text>}

                <Text style={[styles.label, { color: theme.text }]}>Expires Date</Text>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                    placeholderTextColor={theme.clickBackGround}
                    placeholder='MM/YY'
                    onChangeText={text => handleInputChange('expiresDate', text)}
                />

                <Text style={[styles.label, { color: theme.text }]}>CVV</Text>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                    placeholderTextColor={theme.clickBackGround}
                    placeholder='CVV'
                    onChangeText={text => handleInputChange('cvv', text)}
                />

                <TouchableOpacity
                    onPress={saveCard}
                    style={[styles.btn, { backgroundColor: theme.primaryBtn }]}>
                    <Text style={[styles.label, { color: "#f2f2f2" }]}>
                        {loading ? "Loading..." : "Save Card"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(2),
        paddingHorizontal: hp(2),
    },
    text: {
        fontFamily: "Roboto-Bold",
        fontSize: hp(2.5),
    },
    label: {
        fontFamily: "Roboto-Regular",
        fontSize: hp(2),
        marginBottom: hp(0.5),
    },
    form: {
        flex: 1,
        paddingHorizontal: hp(2),
        paddingTop: hp(2),
    },
    input: {
        fontFamily: "Roboto-Regular",
        borderWidth: hp(0.1),
        borderRadius: hp(0.5),
        paddingVertical: hp(1),
        paddingHorizontal: hp(2),
        marginBottom: hp(2),
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(2),
        borderRadius: hp(1),
        marginTop: hp(2),
    },
});
