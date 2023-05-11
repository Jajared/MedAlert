import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import HomeScreen from './pages/HomeScreen';

export default function App() {
  const [allMedicationItems, setAllMedicationItems] = useState([{Name:"Paracetamol", Type: "Pill", Purpose: "Fever", Instructions: [{TabletsPerIntake: 2, FrequencyPerDay: 4, Specifications: "No specific instructions", FirstDosageTiming: 540}]}, {Name:"Metophan", Type:"Liquid", Purpose: "Cough", Instructions: []}]);
  return (
    <View style={styles.container}>
      <HomeScreen props={allMedicationItems}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
