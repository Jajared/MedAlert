import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, SafeAreaView, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";

export default function GuardianInfoItem({ props, navigation, removeGuardian }) {
  const guardianInfo = props.item;
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Patient Medication", { guardianId: guardianInfo.UserId, guardianName: guardianInfo.Name })} testID="GuardianInfoItem">
      <SafeAreaView style={styles.itemContainer}>
        {guardianInfo.Gender == "Female" ? <MaterialCommunityIcons name="face-woman-profile" size={24} color="black" style={{ flex: 1 }} /> : <MaterialCommunityIcons name="face-man-profile" size={24} color="black" style={{ flex: 1 }} />}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{guardianInfo.Name}</Text>
          <Text style={styles.email}>{guardianInfo.EmailAddress}</Text>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.removeButton} onPress={() => setDeleteModalVisible(true)} testID="RemoveButton">
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={isDeleteModalVisible} transparent={true} animationType="slide" testID="DeleteModal">
          <SafeAreaView style={styles.popUpContainer}>
            <View style={styles.popUp}>
              <Text style={styles.header}>Are you sure that you want to remove this guardian?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    removeGuardian(guardianInfo.UserId);
                    setDeleteModalVisible(false);
                  }}
                  style={[styles.button, { backgroundColor: "#F4BFBF" }]}
                >
                  <Text>YES</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setDeleteModalVisible(false);
                  }}
                  style={[styles.button, { backgroundColor: "#F4BFBF" }]}
                >
                  <Text>NO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  infoContainer: {
    flex: 3,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
  },
  name: {
    flex: 3,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  email: {
    flex: 4,
    fontSize: 14,
    color: "#888",
  },
  removeButton: {
    backgroundColor: "#BCBCBC",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
  popUpContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
  },
  popUp: {
    backgroundColor: "white",
    width: "90%",
    height: "30%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    color: "black",
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "black",
    width: 80,
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
    fontSize: 18,
    borderRadius: 40,
  },
});
