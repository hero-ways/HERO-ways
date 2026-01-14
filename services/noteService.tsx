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

const KEY = 'HERO_APP-notes';

type Note = {
  id: string;
  title: string;
  text: string;
  station: string;
};

export const getAllNotes = async () => {
  try {
    const notes = (await AsyncStorage.getItem(KEY)) ?? '[]';
    return JSON.parse(notes) as Note[];
  } catch {
    const notes: [] = [];
    console.warn('Unable to get all notes');
    return notes;
  }
}

export const saveNotesToStore = async (notes: Note[]) => {
  AsyncStorage.setItem(KEY, JSON.stringify(notes));
}

export const getNoteById = async (id: string) => {
  try {
    const notes = await getAllNotes();
    return notes.find(note => note.id === id);
  } catch {
    console.warn('Unable to get note by id');
  }
}

export const saveNote = async (title: string, text: string, station: string) => {
  try {
    const notes = await getAllNotes();
    notes.unshift({ id: Date.now().toString(), title, text, station });
    saveNotesToStore(notes);
  } catch {
    console.warn('Unable to save note');
  }
}

export const editNote = async (id: string, title: string, text: string, station: string) => {
  try {
    const notes = await getAllNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    notes.splice(noteIndex, 1, {
      id,
      title,
      text,
      station
    });

    saveNotesToStore(notes);
  } catch {
    console.warn('Unable to edit note');

  }
}

export const deleteNote = async (id: string) => {
  try {
    const notes = await getAllNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    notes.splice(noteIndex, 1);

    saveNotesToStore(notes);
  } catch {
    console.warn('Unable to delete note')
  }
}