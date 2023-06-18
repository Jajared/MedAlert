import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import callGoogleVisionAsync from "./GoogleVision";

const CameraComponent = ({ onCancel, setIsLoading }) => {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState<string>(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
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
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        setImage(photo.uri);
        setImageData(photo.base64);
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
    setImageData(result.assets[0].base64);
  };

  const handleUseImage = async () => {
    if (imageData) {
      try {
        callGoogleVisionAsync(imageData, setIsLoading);
        setImage(null);
        onCancel();
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
        <TouchableOpacity style={styles.button} onPress={() => setFlashMode(flashMode === FlashMode.off ? FlashMode.on : FlashMode.off)}>
          <Entypo name="flash" size={30} color={flashMode === FlashMode.off ? "white" : "yellow"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}>
          <MaterialIcons name="flip-camera-android" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {!image ? <Camera style={{ flex: 4 }} type={type} ref={cameraRef} flashMode={flashMode} /> : <Image source={{ uri: image }} style={{ flex: 4 }}></Image>}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleCapture}>
          <Entypo name="camera" size={24} color="white" />
          <Text style={styles.text}> Capture </Text>
        </TouchableOpacity>
        {!image ? (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={{ flex: 1, marginLeft: 30 }} onPress={onCancel}>
              <Text style={[styles.text, { alignSelf: "flex-start" }]}> Cancel </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, marginRight: 30 }} onPress={handlePickImage}>
              <Text style={[styles.text, { alignSelf: "flex-end" }]}> Select </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={{ flex: 1, marginLeft: 30 }} onPress={() => setImage(null)}>
              <Text style={[styles.text, { alignSelf: "flex-start" }]}> Re-take </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, marginRight: 30 }} onPress={handleUseImage}>
              <Text style={[styles.text, { alignSelf: "flex-end" }]}> Use this photo </Text>
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
    color: "white",
    fontWeight: "bold",
  },
  topBar: {
    flex: 0.5,
    flexDirection: "row",
  },
  bottomBar: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
