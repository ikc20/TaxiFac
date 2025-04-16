import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PrinterSelectionScreen = ({ route, navigation }: any) => {
  const { device } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Imprimante sélectionnée</Text>

      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceAddress}>{device.address}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TicketFormScreen', { device })}
      >
        <Text style={styles.buttonText}>Continuer vers le formulaire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  deviceInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceAddress: {
    color: '#666',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PrinterSelectionScreen;
