import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

const CameraComponent = ({ onCapture, onCancel }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      onCapture(photo);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={(ref) => {
          cameraRef = ref;
        }}
      />
      <View style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity style={{ alignSelf: "flex-end", margin: 20 }} onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}>
          <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}> Flip </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignSelf: "flex-end", margin: 20 }} onPress={handleCapture}>
          <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}> Capture </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignSelf: "flex-end", margin: 20 }} onPress={onCancel}>
          <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}> Cancel </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CameraComponent;
