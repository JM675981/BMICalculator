import { StyleSheet, Text, Alert, ScrollView, TextInput, Pressable, SafeAreaView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const heightKey = '@height:key'
const resultKey = '@result:key';

export default class App extends Component {
  state = {
    results: '',
    weight: '',
    height: '',
  }

  onWeightChange = (weight) => this.setState({ weight });
  onHeightChange = (height) => this.setState({ height });

  constructor(props) {
    super(props);
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const height = await AsyncStorage.getItem(heightKey);
      this.setState({ height });
      const results = await AsyncStorage.getItem(resultKey);
      this.setState({ results });
    } catch (error) {
      Alert.alert('Error', 'One or more items failed to load');
    }
  }

  onSave = async () => {
    const { weight, height } = this.state;

    const bmi = (weight / (height * height)) * 703;
    const results = "Body Mass Index is " + bmi.toFixed(1);
    this.setState({ results });

    try {
      await AsyncStorage.setItem(heightKey, height);
      await AsyncStorage.setItem(resultKey, results);
    } catch (error) {
      Alert.alert('Error', 'One or more items failed to save');
    }
  }

  render() {
    const { results, weight, height } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.content}>
          <TextInput
            style={styles.input}
            onChangeText={this.onWeightChange}
            value={weight}
            placeholder="Weight in Pounds"
          />
          <TextInput
            style={styles.input}
            onChangeText={this.onHeightChange}
            value={height}
            placeholder="Height in Inches"
          />
          <Pressable onPress={this.onSave} style={styles.button}>
            <Text style={styles.buttonText}>Compute BMI</Text>
          </Pressable>
          <TextInput
            style={styles.bmi}
            value={results}
            editable={false}
            multiline
          />
          <Text style={styles.assess}> Assessing Your BMI </Text>
          <Text style={styles.assess}>&nbsp;&nbsp;&nbsp;&nbsp; Underweight: less than 18.5</Text>
          <Text style={styles.assess}>&nbsp;&nbsp;&nbsp;&nbsp; Healthy: 18.5 to 24.9</Text>
          <Text style={styles.assess}>&nbsp;&nbsp;&nbsp;&nbsp; Overweight: 25.0 to 29.9</Text>
          <Text style={styles.assess}>&nbsp;&nbsp;&nbsp;&nbsp; Obese: 30.0 or higher</Text>

        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#f4511e',
    color: '#fff',
    textAlign: 'center',
    padding: 25,
    paddingTop: 50,
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  bmi: {
    flex: 1,
    fontSize: 28,
    textAlign: 'center',
    padding: 15,
    paddingBottom: 75,
    color: '#000'
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    height: 40,
    padding: 5,
    marginBottom: 10,
    flex: 1,
    fontSize: 24,
  },
  button: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 3,
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  assess: {
    flex: 1,
    fontSize: 20,
  },
});
