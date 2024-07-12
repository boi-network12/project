import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

export default function KycUpdate() {
    const theme = useContext(ThemeContext);
    const { user, postKycData } = useAuth();
    const [ninNumber, setNinNumber] = useState('');
    const [otherName, setOtherName] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const [selfieImage, setSelfieImage] = useState(null);
    const [ninImage, setNinImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSelfieUpload = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.cancelled) {
                setSelfieImage(result.uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error picking image');
        }
    };

    const handleNinImageUpload = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.cancelled) {
                setNinImage(result.uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error picking image');
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!ninNumber || !documentType || !documentNumber) {
                Alert.alert('All fields are required');
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('userId', user?.id);  // Assuming user object contains id
            formData.append('ninNumber', ninNumber);
            formData.append('otherName', otherName);
            formData.append('documentType', documentType);
            formData.append('documentNumber', documentNumber);

            if (selfieImage) {
                formData.append('selfieImage', {
                    uri: selfieImage,
                    name: 'selfie.jpg',
                    type: 'image/jpeg',
                });
            }

            if (ninImage) {
                formData.append('ninImage', {
                    uri: ninImage,
                    name: 'nin.jpg',
                    type: 'image/jpeg',
                });
            }

            await postKycData(formData);

            setNinNumber('');
            setOtherName('');
            setDocumentType('');
            setDocumentNumber('');
            setSelfieImage(null);
            setNinImage(null);

            Alert.alert('KYC submitted successfully');
        } catch (error) {
            console.error('Error submitting KYC:', error);
            Alert.alert('Error submitting KYC');
        } finally {
            setLoading(false);
        }
    };

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
                        placeholder="Other Name"
                        placeholderTextColor={theme.text}
                        value={otherName}
                        onChangeText={setOtherName}
                    />
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                        placeholder="Document Type"
                        placeholderTextColor={theme.text}
                        value={documentType}
                        onChangeText={setDocumentType}
                    />
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                        placeholder="Document Number"
                        placeholderTextColor={theme.text}
                        value={documentNumber}
                        onChangeText={setDocumentNumber}
                    />
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                        placeholder="NiN Number"
                        placeholderTextColor={theme.text}
                        value={ninNumber}
                        onChangeText={setNinNumber}
                    />
                    <View style={styles.uploadContainer}>
                        <TouchableOpacity onPress={handleSelfieUpload}>
                            <Text style={[styles.uploadText, { color: theme.text }]}>Upload your profile (selfie)</Text>
                        </TouchableOpacity>
                        {selfieImage && (
                            <Image source={{ uri: selfieImage }} style={styles.uploadedImage} />
                        )}
                    </View>
                    <View style={styles.uploadContainer}>
                        <TouchableOpacity onPress={handleNinImageUpload}>
                            <Text style={[styles.uploadText, { color: theme.text }]}>Upload your NiN image</Text>
                        </TouchableOpacity>
                        {ninImage && (
                            <Image source={{ uri: ninImage }} style={styles.uploadedImage} />
                        )}
                    </View>
                    <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.primaryBtn }]} onPress={handleSubmit}>
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit for verification</Text>
                        )}
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
    uploadedImage: {
        width: 200,
        height: 200,
        marginTop: 10,
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
