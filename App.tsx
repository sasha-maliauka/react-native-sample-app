import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import NfcManager, { NfcEvents, TagEvent } from 'react-native-nfc-manager';
import { Buffer } from "buffer";

global.Buffer = global.Buffer || require('buffer').Buffer

import QRCodeScanner from 'react-native-qrcode-scanner';
import { BarCodeReadEvent } from 'react-native-camera';


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

  const [message, setMessage] = useState('');

  const setTag = (tag: TagEvent) => {
    setMessage("ID: " + tag?.id + "\nBase64: " + Buffer.from(tag?.id ?? '', 'hex').toString('base64'))
  }

  useEffect(() => {
    NfcManager.isSupported().then((supported: boolean) => {
      if (supported) {
        NfcManager.start();
        NfcManager.registerTagEvent();
      } else {
        setMessage('NFC is not supported');
      }
    }, (rejectionReason) => {
      setMessage('NFC support check was rejected ' + rejectionReason);
    })
  }, [])

  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: TagEvent) => {
      setTag(tag);
    });
    NfcManager.setEventListener(NfcEvents.DiscoverBackgroundTag, (tag: TagEvent) => {
      setTag(tag);
    });

    return () => { NfcManager.unregisterTagEvent(); }
  }, [NfcManager])

  return (
    <View style={styles.container}>
      <Text style={styles.largeText}>I am NFC screen!{"\n"}Place the phone next to RFID-card!</Text>
      <Text style={styles.largeText}>{message}</Text>
    </View>
  );
}

const QrScreen = () => {

  let scanner: QRCodeScanner | null

  const onSuccess = (e: BarCodeReadEvent) => {
    Alert.alert(
      "QR detected!",
      e.data,
      [
        {
          text: "Ok",
          style: "default",
          onPress: () => { scanner?.reactivate() }
        },
      ]
    );
  };

  return (
    <QRCodeScanner
      ref={(node) => { scanner = node }}
      onRead={onSuccess}
      topContent={
        <Text style={styles.largeText}>
          Point your camera at QR code
        </Text>
      }
      vibrate={false}
    />
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
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  largeText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 10,
    marginHorizontal: 16
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
})

export default MyStack;