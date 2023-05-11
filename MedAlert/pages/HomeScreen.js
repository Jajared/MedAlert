import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import MedicationItem from '../components/MedicationItem/MedicationItem';
import { Component } from 'react';
import { FlatList } from 'react-native';

export default class HomeScreen extends Component {
  render() {
    const allMedicationItems = this.props.props;
    return (
      <SafeAreaView style={styles.container}>
        {allMedicationItems && <FlatList data={allMedicationItems} renderItem={(data) => <MedicationItem title={data.Name} props={data}/>} keyExtractor={(item) => item.Name} />}
      </SafeAreaView>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
    width: "100%",
    borderWidth: 2,
    borderColor: "red"
  },
});
