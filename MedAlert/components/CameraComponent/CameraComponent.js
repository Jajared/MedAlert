import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import callGoogleVisionAsync from "./GoogleVision";
import { Entypo } from "@expo/vector-icons";

const CameraComponent = ({ onCapture, onCancel }) => {
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImage(photo.uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });
    setImage(result.assets[0].uri);
    callGoogleVisionAsync(result.assets[0].base64);
  };

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert("Image saved to gallery");
        setImage(null);
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.button} onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}>
          <Entypo name="flash" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {!image ? <Camera style={{ flex: 4 }} type={type} ref={cameraRef} /> : <Image source={{ uri: image }} style={{ flex: 4 }}></Image>}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleCapture}>
          <Entypo name="camera" size={24} color="white" />
          <Text style={styles.text}> Capture </Text>
        </TouchableOpacity>
        {!image ? (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={{ flex: 1, marginLeft: 30 }} onPress={onCancel}>
              <Text style={{ fontSize: 18, color: "white", alignSelf: "flex-start" }}> Cancel </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, marginRight: 30 }} onPress={handlePickImage}>
              <Text style={{ fontSize: 18, color: "white", alignSelf: "flex-end" }}> Select </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={{ flex: 1, marginLeft: 30 }} onPress={() => setImage(null)}>
              <Text style={{ fontSize: 18, color: "white", alignSelf: "flex-start" }}> Re-take </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, marginRight: 30 }} onPress={saveImage}>
              <Text style={{ fontSize: 18, color: "white", alignSelf: "flex-end" }}> Save </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    flexDirection: "column",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
    color: "#f1f1f1",
    fontWeight: "bold",
  },
  topBar: {
    flex: 0.5,
  },
  bottomBar: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
