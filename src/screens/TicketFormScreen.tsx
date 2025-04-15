/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Formik } from 'formik';

const TicketFormScreen = ({ route, navigation }: any) => {
  const { device } = route.params;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>
        Formulaire du Ticket
      </Text>

      <Formik
        initialValues={{
          nom: 'SAHEL MOHAMED',
          immat: 'GS-124-AC',
          stat: '13257 - PARIS',
          debut: '24/09/2024 17:49',
          fin: '24/09/2024 17:49',
          prixCourse: '150.80',
          supplement: '7.00',
          tva: '10',
        }}
        onSubmit={(values) => {
          navigation.navigate('PreviewAndPrintScreen', {
            ticketData: values,
            device,
          });
        }}
      >
        {({ handleChange, handleSubmit, values }) => (
          <>
            {[
              { label: 'Nom', key: 'nom' },
              { label: 'Immatriculation', key: 'immat' },
              { label: 'Statut', key: 'stat' },
              { label: 'Début', key: 'debut' },
              { label: 'Fin', key: 'fin' },
              { label: 'Prix de la course (€)', key: 'prixCourse' },
              { label: 'Supplément (€)', key: 'supplement' },
              { label: 'TVA (%)', key: 'tva' },
            ].map(({ label, key }) => (
              <View key={key} style={{ marginBottom: 15 }}>
                <Text style={{ marginBottom: 5 }}>{label}</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    padding: 10,
                  }}
                  onChangeText={handleChange(key)}
                  value={values[key]}
                />
              </View>
            ))}

            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: '#2196F3',
                padding: 15,
                borderRadius: 10,
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Aperçu & Imprimer</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

export default TicketFormScreen;
