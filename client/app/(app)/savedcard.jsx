import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import SaveCardInputs from '../../components/SaveCardInputs'
import { useAuth } from '../../context/AuthContext'
import { Ionicons } from '@expo/vector-icons'

export default function SavedCard() {
    const { user, addCard, getUserCards, deleteCard  } = useAuth()
    const [savedCards, setSavedCards] = useState([])
    const theme = useContext(ThemeContext)
    const [showCardInput, setShowCardInput] = useState(false)
    const [selectedCard, setSelectedCard] = useState(null)
    const [showCardOptions, setShowCardOptions] = useState(false)
    const [cardDetails, setCardDetails] = useState({
        userId: user?._id,
        cardHolder: '',
        cardNumber: '',
        expiresDate: '',
        pin: '',
        cardType: ''
    })

    const handleShowCardOpen = () => {
        setShowCardInput(true)
    }

    const handleShowCardClose = () => {
        setShowCardInput(false)
    }

    const handleShowCardOptionsOpen = (card) => {
        setSelectedCard(card)
        setShowCardOptions(true)
    }

    const handleShowCardOptionsClose = () => {
        setSelectedCard(null)
        setShowCardOptions(false)
    }

    const isValidExpirationDate = (date) => {
        const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/
        return regex.test(date)
    }

    const handleAddCard = async () => {
        if (!cardDetails.cardNumber || !cardDetails.expiresDate) {
            console.error('Invalid card data: cardNumber and expiresDate are required')
            return
        }

        if (!isValidExpirationDate(cardDetails.expiresDate)) {
            console.error('Invalid expiration date format')
            return
        }

        const result = await addCard(cardDetails)
        if (result.success) {
            fetchUserCards()
            handleShowCardClose()
        } else {
            console.error('Error adding card:', result.error)
        }
    }

    const fetchUserCards = async () => {
        try {
            const result = await getUserCards(user?._id)
            if (result.success) {
                setSavedCards(result.data)
            } else {
                console.error('Error fetching user cards:', result.error)
            }
        } catch (error) {
            console.error('Error fetching user cards:', error)
        }
    }

    const handleDeleteCard = async (cardId) => {
        try {
            const result = await deleteCard(cardId); 
            if (result.success) {
                console.log('Card deleted successfully');
                setShowCardOptions(false)
            } else {
                console.error('Failed to delete card:', result.error);
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };
    

    const handleAddMoney = (cardId) => {
        console.log('Adding money to card:', cardId)
        // Implement add money functionality here
        handleShowCardOptionsClose()
    }

    useEffect(() => {
        fetchUserCards()
    }, [])

    

    const renderCard = ({ item }) => (
        <View style={[styles.cardContainer, { backgroundColor: theme.btnTab }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardText, { color: theme.text }]}>Card Holder: {item.cardHolder}</Text>
                <TouchableOpacity onPress={() => handleShowCardOptionsOpen(item)}>
                    <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>
            <Text style={[styles.cardText, { color: theme.text }]}>Card Number: {item.cardNumber}</Text>
            <Text style={[styles.cardText, { color: theme.text }]}>Expires Date: {item.expiresDate}</Text>
            <Text style={[styles.cardText, { color: theme.text }]}>Card Type: {item.cardType}</Text>
        </View>
    )

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            {savedCards.length > 0 ? (
                <FlatList
                    data={savedCards}
                    renderItem={renderCard}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <View style={[styles.AddedCardContainer, {  }]}>
                    <Image
                        source={require("../../assets/images/card.png")}
                        style={styles.img}
                    />
                    <TouchableOpacity onPress={handleShowCardOpen} style={[styles.btn, { borderColor: theme.primaryBtn }]}>
                        <Text style={[styles.btnText, { color: theme.text }]}>Add Card</Text>
                    </TouchableOpacity>
                </View>
            )}
            <Modal
                animationType='slide'
                transparent={false}
                visible={showCardInput}
                onRequestClose={handleShowCardClose}
            >
                <SaveCardInputs
                    onClose={handleShowCardClose}
                    savedCard={savedCards}
                    theme={theme}
                    setCardDetails={setCardDetails}
                    saveCard={handleAddCard}
                />
            </Modal>
            <Modal
                animationType='slide'
                transparent={true}
                visible={showCardOptions}
                onRequestClose={handleShowCardOptionsClose}
            >
                <View style={styles.optionsModalContainer}>
                    <View style={[styles.optionsModal, { backgroundColor: theme.background }]}>
                        <TouchableOpacity  onPress={() => handleDeleteCard(selectedCard._id)} style={styles.optionButton}>
                            <Text style={[styles.optionButtonText, { color: theme.text }]}>Delete Card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleAddMoney(selectedCard?._id)} style={styles.optionButton}>
                            <Text style={[styles.optionButtonText, { color: theme.text }]}>Add Money</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleShowCardOptionsClose} style={styles.optionButton}>
                            <Text style={[styles.optionButtonText, { color: theme.text }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    AddedCardContainer: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    img: {
        width: hp(30),
        height: hp(30),
        objectFit: "cover",
    },
    btn: {
        width: "50%",
        marginTop: hp(4),
        borderRadius: hp(0.4),
        borderWidth: hp(0.2),
        height: hp(6),
        alignItems: "center",
        justifyContent: "center"
    },
    btnText: {
        fontFamily: "Roboto-Regular",
        fontSize: hp(2)
    },
    cardContainer: {
        padding: hp(3),
        marginTop: hp(3),
        borderRadius: hp(1),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardText: {
        fontFamily: "Roboto-Regular",
        fontSize: hp(2),
        marginBottom: hp(1),
    },
    optionsModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    optionsModal: {
        width: '80%',
        padding: hp(2),
        borderRadius: hp(1),
        alignItems: 'center',
    },
    optionButton: {
        width: '100%',
        paddingVertical: hp(1.5),
        alignItems: 'center',
    },
    optionButtonText: {
        fontFamily: "Roboto-Regular",
        fontSize: hp(2.2),
    }
})
