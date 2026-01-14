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

import { Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { editNote, saveNote } from "../services/noteService";
import { Buttons } from "../styles";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Note = {
  id: string;
  title: string;
  text: string;
  station: string;
}

const SaveNoteButton = ({ id, title, text, station }: Note) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { t } = useTranslation();

  const handleSave = async () => {
    if (!text) {
      Alert.alert(t('notes.warning'), t('notes.noText'));
      return;
    }

    if (id) {
      await editNote(id, title, text, station);
    } else {
      await saveNote(title, text, station);
    }

    navigation.navigate('BackpackIndex');
  }

  return (
    <TouchableOpacity
      onPress={handleSave}
      style={styles.buttonContainer}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{t('general.save')}</Text>
    </TouchableOpacity>
  );
}

export default SaveNoteButton;

const styles = StyleSheet.create({
  buttonContainer: {
    ...Buttons.containers.notes,
    width: '45%',
  },
  buttonText: {
    ...Buttons.texts.notes,
  },
});