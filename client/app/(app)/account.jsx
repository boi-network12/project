import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated, Modal } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Clipboard from 'expo-clipboard';
import NextOfKin from "../../components/NextOfKin"
import { useAlert } from '../../context/AlertContext'
import AccountMail from '../../components/AccountMail'
import { useRouter } from "expo-router"

export default function Account() {
  const theme = useContext(ThemeContext)
  const {
    user, 
    logout, 
    deleteUser, 
    fetchNextOfKin, 
    addNextOfKin, 
    updateNextOfKin ,
    nextOfKin,
    updateUserStatus,
    changeEmail 
   } = useAuth()
  const [showNextOfKin, setShowNextOfKin] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false);
 const [selectedStatus, setSelectedStatus] = useState(user?.status || 'Single');
 const { showAlert } = useAlert();
 const [showEmailModel, setShowEmailModel] = useState(false);
 const router = useRouter();


  
  const scaleAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (user?.kycVerified) {
      
      Animated.spring(scaleAnim, {
        toValue: 1.2, 
        friction: 2, 
        tension: 100, 
        useNativeDriver: true
      }).start()
    } else {
      
      scaleAnim.setValue(0)
    }
  }, [user?.kycVerified])

  const copyToClipboard = () => {
    Clipboard.setString(user?.accountNumber || '');
  };

  const handleOpenNextOfKin = () => {
    setShowNextOfKin(true)
  }

  const handleCloseNextOfKin = () => {
    setShowNextOfKin(false)
  }

  const handleOpenEmailModel = () => {
    setShowEmailModel(true)
  }

  const handleCloseEmailModel = () => {
    setShowEmailModel(false)
  }

  const handleOpenStatusModal = () => {
    setShowStatusModal(true)
  }

  const handleStatusSelect = async (status) => {
    setSelectedStatus(status);
    setShowStatusModal(false);

    try {
      const userId = user._id;
      await updateUserStatus(userId, status);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  const handleLogout = () => {
    showAlert(
      'info',
      'Logout confirmation',
      'Are you sure you want to logout?',
    () => {
      logout();
    },
    () => {
      console.log('Logout cancel')
    }
  )
  }

  const handleDeleteAccount = () => {
    showAlert('info', 'Delete Account', 'Are you sure you want Delete your account', () => {
      deleteUser(user._id)
    },
    () => {
      console.log('Delete cancel')
    }
  )
  }

  const kycOnClick = () => {
    router.push('kycupdate')
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={user?.profilePicture ? { uri: user.profilePicture } : require("../../assets/images/profilePic.png")}
        style={styles.profile}
      />
      <View style={styles.displayNameContainer}>
        <Text style={[styles.Displayname, { color: theme.text }]}>
          {`${user?.lastName} ${user?.firstName} ${user?.otherName} `}
        </Text>
        {user && user?.kycVerified === true ? (
          <Animated.View style={[styles.badgeContainer, { transform: [{ scale: scaleAnim }] }]}>
            <MaterialCommunityIcons name="check-decagram" size={20} color={theme.primaryBtn} />
          </Animated.View>
        ) : null}
      </View>
      <View style={styles.list}>
        <TouchableOpacity 
        onPress={copyToClipboard}
        style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: theme.text }]}>{user?.accountNumber}</Text>
            <Ionicons name="copy" size={20} color={theme.primaryBtn} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: theme.text }]}>{user?.phoneNumber}</Text>
            <Feather name="chevron-right" size={20} color={theme.primaryBtn} />
        </TouchableOpacity>

        <TouchableOpacity 
        onPress={handleOpenEmailModel}
        style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: theme.text }]}>{user?.email}</Text>
          <Feather name="chevron-right" size={20} color={theme.primaryBtn} />
        </TouchableOpacity>

        <TouchableOpacity  
        onPress={kycOnClick}
        style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          {user && user?.kycVerified ? (
            <Text style={[styles.Displayname, { color: theme.text }]}>Verification Complete</Text>
          ) : (
            <Text style={[styles.Displayname, { color: theme.text }]}>Not Verified</Text>
          )}
          {user && user.kycVerified ? (
            <MaterialCommunityIcons name="check-decagram" size={20} color={theme.primaryBtn} />
          ) : (
            <MaterialCommunityIcons name="alert-circle" size={20} color="#ff5c5c" />
          )}
        </TouchableOpacity>

        <TouchableOpacity 
        onPress={handleOpenNextOfKin}
        style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: theme.text }]}>
          Next oF Kin
        </Text>
          <Feather name="chevron-right" size={20} color={theme.primaryBtn} />
        </TouchableOpacity>

        <TouchableOpacity 
        onPress={handleOpenStatusModal}
        style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: theme.text }]}>
            {selectedStatus}
          </Text>
          <Feather name="chevron-right" size={20} color={theme.primaryBtn} />
        </TouchableOpacity>

        <TouchableOpacity 
        onPress={handleDeleteAccount}
        style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: "#ff5c5c" }]}>
            Delete Account
          </Text>
          <FontAwesome name="trash-o" size={20} color="#ff5c5c" />
        </TouchableOpacity>

        <TouchableOpacity 
        onPress={handleLogout}
        style={[styles.clickTouch, { backgroundColor: theme.clickBackGround}]} >
          <Text style={[styles.Displayname, { color: "#ff5c5c" }]}>
            Log out
          </Text>
          <MaterialIcons name="exit-to-app" size={20} color="#ff5c5c" />
        </TouchableOpacity>
      </View>
      <Modal
          animationType="slide"
          transparent={false}
          visible={showNextOfKin}
          onRequestClose={handleCloseNextOfKin}
      >
        <NextOfKin 
          onClose={handleCloseNextOfKin}
          user={user} 
          theme={theme}
          fetchNextOfKin={fetchNextOfKin}
          addNextOfKin={addNextOfKin}
          updateNextOfKin={updateNextOfKin}
          nextOfKin={nextOfKin}
          />
      </Modal>

      <Modal
          animationType='slide'
          transparent={false}
          visible={showEmailModel}
          onRequestClose={handleCloseEmailModel}
      >
        <AccountMail
          onClose={handleCloseEmailModel}
          user={user}
          theme={theme}
          changeEmail={changeEmail}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showStatusModal}
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.modelBg}]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Marital Status</Text>
            <TouchableOpacity onPress={() => handleStatusSelect('single')} style={styles.modalOption}>
              <Text style={[styles.modalOptionText, { color: theme.text}]}>Single</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStatusSelect('married')} style={styles.modalOption}>
              <Text style={[styles.modalOptionText, { color: theme.text}]}>Married</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStatusSelect('divorced')} style={styles.modalOption}>
              <Text style={[styles.modalOptionText, { color: theme.text}]}>Divorced</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStatusSelect('widow')} style={styles.modalOption}>
              <Text style={[styles.modalOptionText, { color: theme.text}]}>Widowed</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStatusSelect('others')} style={styles.modalOption}>
              <Text style={[styles.modalOptionText, { color: theme.text}]}>Others</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowStatusModal(false)} style={[styles.modalCloseButton, { backgroundColor: theme.primaryBtn}]}>
              <Text style={[styles.modalCloseButtonText, { color: theme.dashBoardColorText }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: "100%",
    paddingTop: hp(5)
  },
  text: {},
  profile: {
    width: hp(18),
    height: hp(18),
    objectFit: "cover",
    borderRadius: hp(9),
  },
  displayNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
  },
  Displayname: {
    fontFamily: "Roboto-Bold"
  },
  badgeContainer: {
    marginLeft: hp(1), // Space between the display name and the badge
  },
  badge: {
    width: hp(3), // Adjust size as needed
    height: hp(3),
  },
  list: {
    width: "100%",
    paddingHorizontal: hp(2),
    marginTop: hp(4),
    flexDirection: "column",
    alignItems: "flex-start",
    gap: hp(1)
  },
  clickTouch: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: hp(2),
    alignItems: "center",
    justifyContent: "space-between",
    height: hp(7)
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    padding: hp(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: hp(50),  // Adjust as needed for half of the screen
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    marginBottom: hp(2),
    textAlign: 'center',
  },
  modalOption: {
    padding: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular"
  },
  modalCloseButton: {
    marginTop: hp(2),
    padding: hp(2),
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular"
  },
});
