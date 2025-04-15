/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const PrinterSelectionScreen = ({ route, navigation }: any) => {
  const { device } = route.params;

  const goToForm = () => {
    navigation.navigate('TicketFormScreen', { device });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Imprimante Sélectionnée</Text>
      <View
        style={{
          backgroundColor: '#e0e0e0',
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 16 }}>{device.name || 'Nom inconnu'}</Text>
        <Text style={{ color: 'gray' }}>{device.id}</Text>
      </View>

      <TouchableOpacity
        onPress={goToForm}
        style={{
          backgroundColor: '#4CAF50',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Continuer vers le formulaire</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrinterSelectionScreen;
