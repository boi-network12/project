import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { StatusBar } from "expo-status-bar"
import Entypo from '@expo/vector-icons/Entypo';

const beneficiaries = [
    {
        'id': 1,
        'Name' : 'David'
    },
    {
        'id': 2,
        'Name' : 'Alice'
    },
    {
        'id': 3,
        'Name' : 'John'
    },
    {
        'id': 4,
        'Name' : 'Mary'
    },
    {
        'id': 5,
        'Name' : 'Steve'
    },
    {
        'id': 6,
        'Name' : 'Emily'
    },
    {
        'id': 7,
        'Name' : 'Mike'
    },
    {
        'id': 8,
        'Name' : 'Emma'
    },
    {
        'id': 9,
        'Name' : 'Oliver'
    },
    {
        'id': 10,
        'Name' : 'Sophia'
    },
]

export default function TransferHeader({router}) {
    const theme = useContext(ThemeContext);
    const [beneficiaryList, setBeneficiaryList] = useState(beneficiaries)

    const returnBack = () => {
        router.back();
    }

    const renderItem = ({ item }) => (
        <View style={styles.beneficiaryItem}>
            <View style={[styles.beneficiaryPlaceholder, { backgroundColor: theme.dimPrimaryBtn }]}>
                <Text style={[styles.beneficiaryInitial, { color: theme.dashBoardColorText }]}>{item.Name.charAt(0)}</Text>
            </View>
            <Text style={[styles.beneficiaryName, { color: theme.dashBoardColorText }]}>{item.Name}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.dimPrimaryBtn }]}>
            <StatusBar style='light'/>
            <View style={[styles.secondContainer, { backgroundColor: theme.primaryBtn }]}>
                <View style={styles.navigate}>
                    <TouchableOpacity style={[styles.returnBtn, { backgroundColor: theme.dimPrimaryBtn }]} onPress={returnBack}>
                        <Entypo name='chevron-left' size={hp(3)} color={theme.dashBoardColorText}/>
                    </TouchableOpacity>
                    <Text style={[styles.headerText, { color: theme.dashBoardColorText }]}>
                        Bank Transfer
                    </Text>
                    <View></View>
                </View>

                {/* for beneficiary */}
                {beneficiaryList && (
                    <FlatList
                        data={beneficiaryList}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.beneficiaryList}
                    />
                )}
            </View>
            <Text style={[styles.bottomText, { color: theme.dashBoardColorText }]}>Recent saved beneficiary</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: 'column',
        borderBottomLeftRadius: hp(3),
    },
    bottomText: {
        fontSize: hp(1.6),
        fontFamily: "Roboto-Regular",
        width: "100%",
        paddingLeft: hp(5),
        height: "100%",
        paddingTop: hp(0.5),
        textTransform: "capitalize"
    },
    secondContainer: {
        height: "89%",
        borderBottomLeftRadius: hp(3),
    },
    navigate: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: hp(7),
        paddingHorizontal: hp(3)
    },
    headerText: {
        fontSize: hp(1.8),
        fontFamily: "Roboto-Regular"
    },
    returnBtn: {
        borderRadius: hp(5),
        padding: hp(0.9)
    },
    beneficiaryList: {
        gap: hp(3),
        marginHorizontal: hp(3),
        marginTop: hp(7)
    },
    beneficiaryItem: {
        flexDirection: "column",
        alignItems: "center"
    },
    beneficiaryPlaceholder: {
        width: hp(7),
        height: hp(7),
        borderRadius: hp(3.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(1)
    },
    beneficiaryInitial: {
        fontSize: hp(3),
        fontFamily: "Roboto-Regular"
    },
    beneficiaryName: {
        fontSize: hp(1.6),
        fontFamily: "Roboto-Regular",
        textTransform: "capitalize"
    }
})
