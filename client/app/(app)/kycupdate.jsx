import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

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
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Passport', value: 'passport' },
        { label: 'ID Card', value: 'id_card' },
        { label: 'Driver License', value: 'driver_license' },
    ]);

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
                const selfieName = selfieImage.split('/').pop();
                const selfieType = `image/${selfieName.split('.').pop()}`;
                formData.append('profilePicture', {
                    uri: selfieImage,
                    name: selfieName,
                    type: selfieType,
                });
            }
    
            if (ninImage) {
                const ninName = ninImage.split('/').pop();
                const ninType = `image/${ninName.split('.').pop()}`;
                formData.append('ninImage', {
                    uri: ninImage,
                    name: ninName,
                    type: ninType,
                });
            }
    
            // Debugging line to check the FormData content
            for (let pair of formData._parts) {
                console.log(pair[0] + ': ' + pair[1]);
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
                        placeholderTextColor={theme.clickBackGround}
                        editable={false}
                        selectTextOnFocus={false}
                    />
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                        placeholder="Other Name"
                        placeholderTextColor={theme.clickBackGround}
                        value={otherName}
                        onChangeText={setOtherName}
                    />
                    <DropDownPicker
                        open={open}
                        value={documentType}
                        items={items}
                        setOpen={setOpen}
                        setValue={setDocumentType}
                        setItems={setItems}
                        placeholder="Select Document Type"
                        style={[styles.input, { borderColor: theme.primaryBtn, fontFamily: "Roboto-Regular", color: theme.text, backgroundColor: theme.background  }]}
                        placeholderStyle={{ color: theme.clickBackGround }}
                        dropDownContainerStyle={{ backgroundColor: theme.btnTab}}
                        textStyle={{ color: theme.text, fontFamily: "Roboto-Regular"  }}
                    />
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                        placeholder="Document Number"
                        placeholderTextColor={theme.clickBackGround}
                        value={documentNumber}
                        onChangeText={setDocumentNumber}
                    />
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
                        placeholder="NiN Number"
                        placeholderTextColor={theme.clickBackGround}
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
        fontFamily: "Roboto-Regular",
        borderWidth: hp(.1),
        padding: hp(1),
        marginBottom: hp(4),
        marginTop: hp(1)
    },
    uploadContainer: {
        marginBottom: 16,
    },
    uploadText: {
        fontSize: 16,
        marginBottom: 8,
        fontFamily: "Roboto-Regular",
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
        fontFamily: "Roboto-Regular",
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "Roboto-Bold",
    },
});
