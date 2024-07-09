import { ActivityIndicator, StyleSheet, View } from "react-native";
import { widthPercentageToDP as Wp, heightPercentageToDP as hp} from "react-native-responsive-screen"


export default function StartPage(){
    return(
        <View style={styles.container}>
            <ActivityIndicator size={hp(10)}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})