import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TicketData } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketFormScreen'>;

const TicketFormScreen = ({ route, navigation }: Props) => {
  const { device } = route.params;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>
        Formulaire du Ticket
      </Text>

      <Formik<TicketData>
        initialValues={{
          nom: '',
          immat: '',
          stat: '',
          debut: '',
          fin: '',
          prixCourse: '',
          supplement: '',
          tva: '',
        }}
        onSubmit={(values) => {
          navigation.navigate('PreviewAndPrintScreen', { ticketData: values, device });
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
                  value={values[key as keyof TicketData]}
                  keyboardType={['prixCourse', 'supplement', 'tva'].includes(key) ? 'numeric' : 'default'}
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
