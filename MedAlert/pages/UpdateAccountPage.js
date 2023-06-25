import { Text, SafeAreaView, StyleSheet, View, Image, TextInput, TouchableOpacity, Button, StatusBar, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useState } from "react";
import BackNavBar from "../components/BackNavBar/BackNavBar";
import CalendarPicker from "react-native-calendar-picker";
import Modal from "react-native-modal";
import * as React from "react";
import CustomButton from "../components/Buttons/CustomButton";
import DropDownPicker from "react-native-dropdown-picker";

export default function UpdateAccountPage({ navigation, userInformation, updateUserInformation }) {
  const [state, setState] = useState({ ...userInformation });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [selectedDOB, setSelectedDOB] = useState(null);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);
  function onDateChange(date) {
    var newDate = (date.date() < 10 ? "0" + date.date() : date.date()) + "/" + (date.month() < 10 ? "0" + +(parseInt(date.month()) + 1) : parseInt(date.month()) + 1) + "/" + date.year();
    setSelectedDOB(date);
    setState({ ...state, DateOfBirth: newDate });
  }

  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const isEmailValid = validateEmail(state.EmailAddress);

  /** const handleProfilePictureChange = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
      base64: true,
    });
    if (!pickerResult.canceled) {
      const base64Image = "data:image/png;base64," + pickerResult.assets[0].base64;
      setProfilePicture(`data:image/png;base64,${base64Image}`);
      updateProfilePicture(base64Image);
    }
  }; */

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <BackNavBar navigation={navigation} title="Update Account" />

        <View style={styles.mainSection}>
          <View style={styles.subSection}>
            <View style={styles.title}>
              <Text style={styles.text}> Name: </Text>
            </View>
            <View style={styles.editBox}>
              <TextInput value={state.Name} onChangeText={(text) => setState({ ...state, Name: text })}></TextInput>
            </View>
          </View>

          <View style={styles.subSection}>
            <View style={styles.title}>
              <Text style={styles.text}> Email Address: </Text>
            </View>
            <View style={styles.editBox}>
              <Text>{state.EmailAddress}</Text>
            </View>
          </View>

          <View style={styles.subSection}>
            <View style={styles.title}>
              <Text style={styles.text}> Phone Number: </Text>
            </View>
            <View style={styles.editBox}>
              <TextInput value={state.PhoneNumber} onChangeText={(text) => setState({ ...state, PhoneNumber: text })} keyboardType="numeric"></TextInput>
            </View>
          </View>

          <View style={[styles.subSection, { zIndex: 2 }]}>
            <View style={styles.title}>
              <Text style={styles.text}> Gender: </Text>
            </View>
            <DropDownPicker
              placeholder="Select One"
              open={dropDownOpen}
              setOpen={setDropDownOpen}
              items={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Prefer not to say", value: "Prefer not to say" },
              ]}
              value={state.Gender}
              onSelectItem={(item) => {
                setState({ ...state, Gender: item.value });
              }}
              style={styles.editBox}
            />
          </View>

          <View style={[styles.subSection, { zIndex: 1 }]}>
            <View style={styles.title}>
              <Text style={styles.text}> Date of Birth: </Text>
            </View>
            <TouchableOpacity style={styles.editBox} onPress={handleModal}>
              <Text>{state.DateOfBirth}</Text>
            </TouchableOpacity>

            <Modal isVisible={isModalVisible} animationType="slide" transparent={true}>
              <View style={styles.calendar}>
                <CalendarPicker onDateChange={onDateChange} selectedDayColor="#DE3163" />
                <Button title="Hide calendar" onPress={handleModal} />
              </View>
            </Modal>
          </View>
        </View>

        <CustomButton
          title="Update"
          onPress={() => {
            updateUserInformation(state);
            navigation.goBack();
          }}
        />
        <View style={styles.emptySection}></View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    justifyContent: "center",
  },
  emptySection: {
    flex: 1,
  },

  text: {
    fontWeight: "bold",
  },

  calendar: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});
