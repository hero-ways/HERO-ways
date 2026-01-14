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

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'HERO_APP-backpack';

type BackpackEntry = {
  filePath: string;
  station: string;
};


export const getAllBackpackEntries = async () => {
  try {
    const entries = (await AsyncStorage.getItem(KEY)) ?? '[]';
    return JSON.parse(entries) as BackpackEntry[];
  } catch {
    const entries: [] = [];
    console.warn('Unable to get all backpack entries');
    return entries;
  }
}

export const deleteBackpackEntry = async (filePath: string) => {
  try {
    const entries = await getAllBackpackEntries();
    const entryIndex = entries.findIndex(note => note.filePath === filePath);

    entries.splice(entryIndex, 1);

    await AsyncStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    console.warn('Unable to delete note')
  }
}
