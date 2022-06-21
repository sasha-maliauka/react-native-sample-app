import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';


type RootStackParamList = {
  Home: undefined;
  Nfc: undefined;
  Qr: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Nfc"
          component={NfcScreen}
          options={{ title: "NFC" }}
        />
        <Stack.Screen
          name="Qr"
          component={QrScreen}
          options={{ title: "QR" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const NfcScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={styles.largeText}>I am NFC screen!</Text>
    </View>
  );
}

const QrScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={styles.largeText}>I am QR screen!</Text>
    </View>
  );
}

const HomeScreen = ({ }: Props) => {
  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly' }}>
      <NavButton destination='Nfc' />
      <NavButton destination='Qr' />
    </View>
  );
}

type NavigationProp = Props['navigation'];

const NavButton = (props: {
  destination: keyof RootStackParamList;
}) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(props.destination)}>
      <Text style={styles.largeText}>
        Go to {props.destination.toUpperCase()}!
      </Text>
    </TouchableOpacity>);
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  largeText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: "700"
  }
})

export default MyStack;