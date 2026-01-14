/**
 * // Copyright LBI-DHP and/or licensed to LBI-DHP under one or more
 * // contributor license agreements (LBI-DHP: Ludwig Boltzmann Institute
 * // for Digital Health and Prevention -- A research institute of the
 * // Ludwig Boltzmann Gesellschaft, Österreichische Vereinigung zur
 * // Förderung der wissenschaftlichen Forschung).
 * // Licensed under the Apache 2.0 license with Commons Clause
 * // (see https://www.apache.org/licenses/LICENSE-2.0 and
 * // https://commonsclause.com/)
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import Background from "@/assets/images/roadBackground.svg";
import SaveNoteButton from "@/components/SaveNoteButton";
import { getNoteById } from "@/services/noteService";
import { Buttons, Colors } from "@/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

const stationColors: Record<string, string> = {
  clinic: Colors.theme.red,
  home: Colors.theme.purple,
  rehab: Colors.theme.blueDark
}

type routeParams = {
  id: string
}

const AddNoteScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [currentBuilding, setCurrentBuilding] = useState<string>('clinic'); // Stores which building has been selected in home screen.
  const [activeStation, setActiveStation] = useState(''); // Stores current filter.
  const title = new Date().toLocaleDateString('en-GB');
  const route = useRoute<any>();
  const params = route.params as routeParams;
  const id = params.id;

  const getCurrentStation = async () => {
    try {
      const building = await AsyncStorage.getItem('current-station');
      // Set state after fetching data.
      if (building) {
        setCurrentBuilding(building);
        setActiveStation(building);
      }
    } catch (error) {
      console.error('Unable to get data: ', error);
    }
  }

  useEffect(() => {
    if (id) {
      getNoteById(id).then(note => setText(note?.text!));
    }
  }, [id]);

  useEffect(() => {
    getCurrentStation();
  }, [currentBuilding]);

  return (
    <>
      <Background width="100%" height="100%" style={styles.background} />
      <View style={styles.backgroundContainer}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollArea}>

          <Text style={styles.title}>{t('notes.newNote')}</Text>

          <View style={styles.slideContainer}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, marginHorizontal: 10 }}>
              <TouchableOpacity
                onPress={() => setActiveStation('clinic')}
                style={[styles.buttonStationContainer, { backgroundColor: activeStation === 'clinic' || activeStation === '' ? Colors.theme.red : 'transparent' }]}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.buttonStationText, { color: activeStation === 'clinic' || activeStation === '' ? Colors.theme.white : Colors.theme.red }]}
                >{t('home.popups.titles.clinic')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveStation('home')}
                style={[styles.buttonStationContainer, { borderColor: Colors.theme.purple, backgroundColor: activeStation === 'home' ? Colors.theme.purple : 'transparent' }]}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.buttonStationText, { color: activeStation === 'home' ? Colors.theme.white : Colors.theme.purple }]}
                >{t('home.popups.titles.home')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveStation('rehab')}
                style={[styles.buttonStationContainer, { borderColor: Colors.theme.blueDark, backgroundColor: activeStation === 'rehab' ? Colors.theme.blueDark : 'transparent' }]}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.buttonStationText, { color: activeStation === 'rehab' ? Colors.theme.white : Colors.theme.blueDark }]}
                >{t('home.popups.titles.rehab')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={[styles.cardTitleWrapper, { backgroundColor: stationColors[activeStation] || Colors.theme.red }]}>
                <Text style={styles.cardTitle}>{title}</Text>
              </View>

              <TextInput
                style={[styles.input, { borderColor: stationColors[activeStation] || Colors.theme.red }]}
                value={text}
                onChangeText={setText}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.buttonWrapper}>
            <SaveNoteButton id={id ?? ''} title={title} text={text} station={activeStation || 'clinic'} />

            <TouchableOpacity
              onPress={() => navigation.navigate('BackpackIndex')}
              style={styles.buttonContainer}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t('general.back')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView >
      </View>
    </>
  );
};

export default AddNoteScreen;

const styles = StyleSheet.create({
  scrollArea: {
    flexGrow: 1
  },
  background: {
    position: 'absolute',
    zIndex: -1
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: Colors.theme.blueDarkOpacity25,
    paddingHorizontal: 28,
  },
  slideContainer: {
    backgroundColor: "rgba(228, 236, 237, .6)",
    borderRadius: 30,
    flexGrow: 1
  },
  title: {
    color: Colors.theme.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 23,
    textAlign: 'center',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20
  },
  buttonContainer: {
    ...Buttons.containers.notes,
    width: '45%',
  },
  buttonText: {
    ...Buttons.texts.notes,
  },
  input: {
    fontSize: 16,
    flex: 1,
    borderWidth: 1,
    padding: 14,
    margin: 30,
    color: Colors.theme.black,
    lineHeight: 20
  },
  card: {
    backgroundColor: Colors.theme.white,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 20,
    flexGrow: 1,
    minHeight: 100
  },
  cardTitleWrapper: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.theme.red
  },
  cardTitle: {
    color: Colors.theme.white,
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  cardBody: {
    padding: 30,
  },
  buttonStationContainer: {
    ...Buttons.containers.outline,
    backgroundColor: 'transparent',
    borderWidth: 2
  },
  buttonStationText: {
    ...Buttons.texts.outline,
    textTransform: 'none',
  }
});