import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import Entypo from '@expo/vector-icons/Entypo';

export default function NextOfKin({ theme, onClose, user, fetchNextOfKin, addNextOfKin, updateNextOfKin }) {
    const [nextOfKin, setNextOfKin] = useState(null);
    const [name, setName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');  // Changed contact to phoneNumber
    const [address, setAddress] = useState('');
    const [statusOpen, setStatusOpen] = useState(false);
    const [statusItems] = useState(['Single', 'Mother', 'Father', 'Child']);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadNextOfKin = async () => {
            const data = await fetchNextOfKin(); // Fetch the Next of Kin data
            if (data && data.length > 0) {
                setNextOfKin(data[0]); // Assuming you have only one Next of Kin
                setName(data[0].name);
                setRelationship(data[0].relationship);
                setPhoneNumber(data[0].phoneNumber);  // Changed contact to phoneNumber
                setAddress(data[0].address);
            }
        };

        loadNextOfKin();
    }, [fetchNextOfKin]);

    const handleSubmit = async () => {
        setLoading(true);
        const nextOfKinData = { name, relationship, phoneNumber, address, userId: user.id };  // Changed contact to phoneNumber
        try {
          if (nextOfKin) {
            await updateNextOfKin(nextOfKin._id, nextOfKinData);
          } else {
            await addNextOfKin(nextOfKinData);
          }
          alert('Next of Kin information saved successfully');
        } catch (error) {
          console.error('Error saving next of kin data:', error.message);
          alert('Failed to save Next of Kin information');
        } finally {
          setLoading(false);
        }
      };
      

    const handleChange = (field, value) => {
        switch (field) {
            case 'name':
                setName(value);
                break;
            case 'relationship':
                setRelationship(value);
                break;
            case 'phoneNumber':  
                setPhoneNumber(value);
                break;
            case 'address':
                setAddress(value);
                break;
            default:
                break;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TouchableOpacity style={{ position: 'absolute', top: hp(5), left: hp(2) }} onPress={onClose}>
                <Entypo name="chevron-left" size={hp(4)} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.text, { color: theme.text }]}>Next of Kin</Text>
            <View style={styles.secondC}>
                <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.btnTab, color: theme.text }]}
                    placeholder={nextOfKin ? nextOfKin.name : 'Enter Full Name'}
                    placeholderTextColor={theme.text}
                    value={name || ''}
                    onChangeText={(text) => handleChange('name', text)}
                />

                <Text style={[styles.label, { color: theme.text }]}>Relationship</Text>
                <DropDownPicker
                    open={statusOpen}
                    value={relationship}
                    items={statusItems.map(option => ({ label: option, value: option }))}
                    setOpen={setStatusOpen}
                    setValue={(value) => handleChange('relationship', value)}
                    placeholder='Select Relationship'
                    placeholderStyle={{ color: theme.text }}
                    style={{ backgroundColor: theme.btnTab }}
                    dropDownContainerStyle={{ backgroundColor: theme.btnTab }}
                    textStyle={{ color: theme.text }}
                />

                <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.btnTab, color: theme.text }]}
                    placeholderTextColor={theme.text}
                    placeholder={nextOfKin ? '' : 'Phone Number'}
                    keyboardType='phone-pad'
                    value={phoneNumber || ''}  
                    onChangeText={(text) => handleChange('phoneNumber', text)}  
                />

                <Text style={[styles.label, { color: theme.text }]}>Address</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.btnTab, color: theme.text }]}
                    placeholderTextColor={theme.text}
                    placeholder={nextOfKin ? '' : 'Enter Address'}
                    value={address || ''}
                    onChangeText={(text) => handleChange('address', text)}
                />

                <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primaryBtn }]} onPress={handleSubmit}>
                    {loading ? (
                        <Text style={{ color: theme.text, fontFamily: "Roboto-Regular" }}>Loading...</Text>
                    ) : (
                        <Text style={{ color: theme.text, fontFamily: "Roboto-Regular" }}>{nextOfKin ? 'Update' : 'Save'}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(4),
        width: '100%',
        position: 'relative'
    },
    text: {
        fontFamily: 'Roboto-Bold',
        fontSize: hp(3),
        textAlign: 'center'
    },
    secondC: {
        marginTop: hp(4),
        paddingHorizontal: hp(2)
    },
    label: {
        fontSize: hp(2.2),
        color: 'black',
        fontFamily: 'Roboto-Regular',
        marginBottom: hp(1)
    },
    input: {
        height: hp(7),
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: hp(2),
        paddingHorizontal: hp(2),
        fontFamily: 'Roboto-Regular',
    },
    saveButton: {
        paddingVertical: hp(2.5),
        paddingHorizontal: hp(2),
        borderRadius: 5,
        alignItems: 'center',
        marginTop: hp(2)
    }
});
