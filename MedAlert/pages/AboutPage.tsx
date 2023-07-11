import { SafeAreaView, View, Text, StatusBar, StyleSheet, Image } from "react-native";
import BackNavBar from "../components/BackNavBar";

export default function AboutPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="About" />
      <View style={styles.headerSection}>
      <Text style={{fontSize: 16, color: "#5A5A5A"}}>{`Forgetting to take medication is a common problem, especially in a country like Singapore, which has so many people diagnosed with chronic illnesses (such as diabetes and hypertension) who rely on medication every single day. Various medications must be consumed at various frequencies which makes consumption tracking tedious and confusing.\n\nMedAlert aims to provide a user-friendly solution for individuals to manage their medication schedules efficiently.`} 
</Text>
      </View>
<View style={styles.referenceSection}>
  <Text>References:</Text>
  <View style={styles.referenceIcons}>
  <Image source={require("../assets/data-gov.png")} style={styles.icon}/>
  <Image source={require("../assets/apimedic-icon.png")} style={styles.icon}/>
  </View>
  
</View>
<View style={{flex:1}}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
  }, headerSection: {
    width: "90%",
    flex: 2
  },
    referenceSection: {
      flex:2,
    width: "90%",
  }, referenceIcons: {
    flexDirection:"row"
  },icon: {
    flex:1,
    margin: 10,
    height: 120,
    resizeMode: "contain",
  }
});
