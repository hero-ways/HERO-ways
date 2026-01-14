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

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BackpackIndex from "./notes/index";
import AddNoteScreen from "./notes/addNote";

const Stack = createNativeStackNavigator();

const BackpackScreen = ({ }) => {
  return (
    <Stack.Navigator initialRouteName="BackpackIndex" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="BackpackIndex" component={BackpackIndex} />
      <Stack.Screen name="AddNote" component={AddNoteScreen} />
    </Stack.Navigator>
  );
}

export default BackpackScreen;
