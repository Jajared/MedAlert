import { Text, SafeAreaView, StyleSheet, View, Image, TextInput, TouchableOpacity, Button } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import CalendarPicker from "react-native-calendar-picker";
import Modal from "react-native-modal";
import * as React from "react";

export default function UpdateAccountPage({ navigation, userInformation, setUserInformation }) {
  const [state, setState] = useState({ ...userInformation });
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedDOB, setSelectedDOB] = useState(null);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);
  function onDateChange(date) {
    var newDate = (date.dates() < 10 ? "0" + date.dates() : date.dates()) + "/" + (date.months() < 10 ? "0" + date.months() : date.months()) + "/" + date.year();
    setSelectedDOB(date);
    setState({ ...state, DateOfBirth: newDate });
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Update Account" />
      {/* <Text>Update Account Page</Text> */}
      <View style={styles.profileSection}>
        <View style={styles.profileImage}>
          <Image source={userInformation.ProfileImage} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />
        </View>
        <Button title="Update Profile Picture" />
        {/* //Create touchable opacity to change profile picture */}
      </View>

      <View style={styles.mainSection}>
        <View style={styles.subSection}>
          <View style={styles.title}>
            <Text style={styles.text}> Name: </Text>
          </View>
          <View style={styles.editBox}>
            <TextInput value={state.Username} onChangeText={(text) => setState({ ...state, Username: text })}></TextInput>
          </View>
        </View>

        {/* <TextInput value={userInformation.Username} onChangeText={(text) => setUserInformation()}></TextInput> */}
        <View style={styles.subSection}>
          <View style={styles.title}>
            <Text style={styles.text}> Email Address: </Text>
          </View>
          <View style={styles.editBox}>
            <TextInput value={state.EmailAddress} onChangeText={(text) => setState({ ...state, EmailAddress: text })}></TextInput>
          </View>
        </View>

        <View style={styles.subSection}>
          <View style={styles.title}>
            <Text style={styles.text}> Phone Number: </Text>
          </View>
          <View style={styles.editBox}>
            <TextInput value={state.PhoneNumber} onChangeText={(text) => setState({ ...state, PhoneNumber: text })}></TextInput>
          </View>
        </View>

        <View style={styles.subSection}>
          <View style={styles.title}>
            <Text style={styles.text}> Gender: </Text>
          </View>
          <View style={styles.editBox}>
            <TextInput value={state.Gender} onChangeText={(text) => setState({ ...state, Gender: text })}></TextInput>
          </View>
        </View>

        <View style={styles.subSection}>
          <View style={styles.title}>
            <Text style={styles.text}> Date of Birth: </Text>
          </View>
          <TouchableOpacity style={styles.editBox} onPress={handleModal}>
            <Text>{state.DateOfBirth}</Text>
          </TouchableOpacity>

          <Modal isVisible={isModalVisible}>
            <View style={{ backgroundColor: "white", width: "100%" }}>
              <CalendarPicker onDateChange={onDateChange} />
              <Button title="Hide modal" onPress={handleModal} />
            </View>
          </Modal>
        </View>
      </View>

      <View>
        <Button
          title="Update"
          onPress={() => {
<<<<<<< HEAD
            setUserInformation(state)
            navigation.goBack()
          }
          }
          />
=======
            if (handleSubmit() == true) {
              navigation.navigate("Add Medication Schedule", { state });
            }
          }}
        />
>>>>>>> ce6b1a9 (Added Jamal.)
      </View>
      <View style={styles.emptySection}></View>
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

  profileSection: {
    flex: 1,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#fff",
  },

  profileName: {
    fontWeight: "bold",
    fontSize: 20,
    margin: 5,
  },

  mainSection: {
    flex: 5,
    width: "70%",
  },

  subSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    alignItems: "center",
  },

  editBox: {
    height: 50,
    borderWidth: 1,
    width: "100%",
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  emptySection: {
    flex: 1,
  },

  text: {
    fontWeight: "bold",
  },

  calendar: {
    width: "100%",
  },
});
