import { SafeAreaView, View, Text, StatusBar, StyleSheet, Image } from "react-native";
import BackNavBar from "../components/BackNavBar";

export default function HelpPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackNavBar navigation={navigation} title="Help" />
      <Text style={{ fontSize: 16, alignSelf: "flex-start", marginLeft: 30 }}>Feel free to contact us at:</Text>
      <View style={styles.itemContainer}>
        <Image source={require("../assets/boy.png")} style={styles.icon} />
        <View style={styles.textInfo}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Jared Wong Jing Jie</Text>
          <Text>Y2 Computer Science Student</Text>
          <Text>E0934112@u.nus.edu</Text>
        </View>
      </View>
      <View style={styles.itemContainer}>
        <Image source={require("../assets/girl.png")} style={styles.icon} />
        <View style={styles.textInfo}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Priscilia Pang Qing Wei</Text>
          <Text>Y2 Business Analytics Student</Text>
          <Text>E0968980@u.nus.edu</Text>
        </View>
      </View>
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
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FAF0D7",
    borderColor: "#FAF0D7",
    borderWidth: 1,
    borderRadius: 15,
    margin: 15,
    alignItems: "center",
    height: 100,
    width: "90%",
  },
  textContainer: {
    flex: 3,
    flexDirection: "row",
  },
  textInfo: {
    flex: 2,
    paddingHorizontal: 15,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginLeft: 20,
  },
});
