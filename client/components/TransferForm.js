import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import CustomKeyboardView from './customeKeyboard';
import DropDownPicker from 'react-native-dropdown-picker';
import { ThemeContext } from '../context/ThemeContext';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieAnimation from './MarkAnimation';

const bankList = [
  { label: 'current bank name', value: '1' },
  { label: 'other bank 2', value: '2' },
  { label: 'other bank 3', value: '3' },
  { label: 'other bank 4', value: '4' },
  { label: 'other bank 5', value: '5' },
  { label: 'other bank 6', value: '6' },
  { label: 'other bank 7', value: '7' },
  { label: 'other bank 8', value: '8' },
];

export default function TransferForm({ sendMoney, handleGetUserToTransfer, router }) {
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(bankList);
  const theme = useContext(ThemeContext);
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [receiverDetails, setReceiverDetails] = useState({});
  const [loading, setLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  

  const onModelClose = () => {
    setModalVisible(!modalVisible);
  }

  const onConfirmModalClose = () => {
    setConfirmModal(!confirmModal);
    router.replace('/home')
  }

  const fetchRecipientDetails = async () => {
    try {
      setLoading(true)
      const recipientDetails = await handleGetUserToTransfer(recipientAccountNumber);
      setReceiverDetails({ ...recipientDetails, amount });
      console.log('Recipient Details:', recipientDetails);
      setLoading(false)
      setModalVisible(true); 
    } catch (error) {
    setLoading(false)
      console.error('Error fetching recipient details:', error);
      // Handle error state or display an error message
    }
  }

  const handleTransfer = async () => {
    try {
      setLoading(true)
      const result = await sendMoney(recipientAccountNumber, amount, note);
      console.log('Transfer result: ', result);
      setLoading(false);
      setModalVisible(false);
      setConfirmModal(true);
      // Handle success (e.g., show a success message or update UI)
    } catch (error) {
      console.error('Transfer failed:', error);
      setLoading(false)
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <CustomKeyboardView>
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.text }]}>Bank Name</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder='Select bank'
          style={[styles.dropdown, { borderColor: theme.primaryBtn, backgroundColor: theme.clickBackGround, height: hp(6), overflow: 'hidden', color: theme.text }]}
          dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: theme.clickBackGround }]}
          searchable
          placeholderStyle={[styles.placeholderStyle, { color: theme.dropDownText }]}
          selectedItemLabelStyle={[styles.selectedItemLabelStyle, { color: theme.text }]}
          searchTextInputStyle={styles.searchTextInputStyle}
          searchPlaceholderTextColor={theme.dropDownText}
          searchContainerStyle={styles.searchContainerStyle}
          labelStyle={[{ fontFamily: 'Roboto-Regular' }]}
        />
      </View>
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.text }]}>Account Number</Text>
        <TextInput
          placeholder='0123456789'
          keyboardType='phone-pad'
          style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
          placeholderTextColor={theme.clickBackGround}
          value={recipientAccountNumber}
          onChangeText={setRecipientAccountNumber}
        />
      </View>
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.text }]}>Amount</Text>
        <TextInput
          placeholder='Minimum 100'
          style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
          placeholderTextColor={theme.clickBackGround}
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.text }]}>Add Note (Optional)</Text>
        <TextInput
          placeholder="What's this for?"
          style={[styles.input, { color: theme.text, borderColor: theme.primaryBtn }]}
          placeholderTextColor={theme.clickBackGround}
          value={note}
          onChangeText={setNote}
        />
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primaryBtn }]} onPress={fetchRecipientDetails}>
          <Text style={[styles.btnText, { color: theme.dashBoardColorText }]}>Continue</Text>
        </TouchableOpacity>
      </View>
      
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={onModelClose}
            
        >
          <View style={[styles.model, { backgroundColor: theme.modelBg }]} >
            <Text style={[styles.modalTextHeader, { color: theme.text }]}>Confirm User</Text>
            <Text style={styles.modalText}>Account Number: {recipientAccountNumber}</Text>
            <Text style={styles.modalText}>Amount: ₦{receiverDetails.amount}</Text>
            <Text style={styles.modalText}>{`${receiverDetails.lastName} ${receiverDetails.firstName} ${receiverDetails.otherName}`}</Text>
            <TouchableOpacity style={[styles.btnModel, { backgroundColor: theme.primaryBtn }]} onPress={handleTransfer}>
          {loading ? 
          <ActivityIndicator color={theme.text}/> : 
          <Text style={[styles.btnText, { color: theme.dashBoardColorText }]}>COnfirm Payment</Text>
          }
        </TouchableOpacity>
          </View>
        </Modal>
{/* 0031366603 */}
        <Modal
            animationType='slide'
            transparent={false}
            visible={confirmModal}
            onRequestClose={onConfirmModalClose}
        >
          <View style={[styles.confirmPage, { background: theme.background}]} >
            <LottieAnimation/>
          </View>
        </Modal>
      
    </CustomKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: hp(3),
    marginBottom: hp(2.5),
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    paddingHorizontal: hp(3),
    borderRadius: hp(0.5),
    fontFamily: 'Roboto-Regular',
  },
  dropdownContainer: {
    borderRadius: 0,
    fontFamily: 'Roboto-Regular',
    position: 'absolute',
    zIndex: 99999,
  },
  placeholderStyle: {
    textTransform: 'capitalize',
    fontFamily: 'Roboto-Regular',
  },
  searchTextInputStyle: {
    fontSize: hp(1.5),
    fontFamily: 'Roboto-Regular',
    borderWidth: 0,
    zIndex: 999,
  },
  searchContainerStyle: {
    borderColor: '#ccc',
    padding: 0,
  },
  selectedItemLabelStyle: {
    fontFamily: 'Roboto-Regular',
  },
  input: {
    borderWidth: hp(0.2),
    paddingHorizontal: hp(3),
    borderRadius: hp(0.5),
    fontFamily: 'Roboto-Regular',
    height: hp(6),
  },
  btn: {
    width: '100%',
    height: hp(7),
    marginBottom: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  model: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: hp(40),
    borderTopRightRadius: hp(3),
    borderTopLeftRadius: hp(3),
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: hp(2),
    paddingTop: hp(2)
  },
  modalTextHeader: {
    fontSize: hp(3),
    fontFamily: "Roboto-Bold",
    textTransform: "capitalize",
    width: "100%",
    textAlign: "center",
    marginBottom: hp(3.5)
  },
  modalText:{
    fontFamily: "Roboto-Regular",
    marginBottom: hp(2),
    fontSize: hp(2)
  },
  btnModel: {
    width: '94%',
    height: hp(7),
    marginTop: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmPage: {
    width: '100%',
    height: "100%",
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: 'column',
  }
});
