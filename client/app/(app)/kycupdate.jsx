import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function KycUpdate() {
    const theme = useContext(ThemeContext);
    const { user } = useAuth();
    const [ninNumber, setNinNumber] = useState('');
    const [selfieImage, setSelfieImage] = useState(null);
    const [ninImage, setNinImage] = useState(null);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {user && user.kycVerified ? (
                <View style={styles.messageContainer}>
                    <Text style={[styles.message, { color: theme.text }]}>Congrats you have been verified</Text>
                </View>
            ) : (
                <View style={styles.formContainer}>
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                        placeholder={`Surname: ${user?.lastName}  FirstName: ${user?.firstName}`}
                        placeholderTextColor={theme.text}
                        editable={false}
                        selectTextOnFocus={false}
                    />
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                        placeholder={`Email: ${user?.email}`}
                        placeholderTextColor={theme.text}
                        editable={false}
                        selectTextOnFocus={false}
                    />
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                        placeholder={`Other name: ${user?.otherName || "Add other name"} `}
                        placeholderTextColor={theme.text}
                        editable={true}
                        onChangeText={(text) => {/* Handle other name input */}}
                    />
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                        placeholder="NiN Number"
                        placeholderTextColor={theme.text}
                        value={ninNumber}
                        onChangeText={setNinNumber}
                    />
                    <View style={styles.uploadContainer}>
                        <Text style={[styles.uploadText, { color: theme.text }]}>Upload your profile (selfie)</Text>
                        {/* Add your upload functionality here */}
                        {/* Example: <TouchableOpacity onPress={handleSelfieUpload}><Text>Upload</Text></TouchableOpacity> */}
                    </View>
                    <View style={styles.uploadContainer}>
                        <Text style={[styles.uploadText, { color: theme.text }]}>Upload your NiN image</Text>
                        {/* Add your upload functionality here */}
                        {/* Example: <TouchableOpacity onPress={handleNinImageUpload}><Text>Upload</Text></TouchableOpacity> */}
                    </View>
                    <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.primaryBtn }]}>
                        <Text style={styles.submitButtonText}>Submit for verification</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    messageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    message: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    uploadContainer: {
        marginBottom: 16,
    },
    uploadText: {
        fontSize: 16,
        marginBottom: 8,
    },
    submitButton: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
