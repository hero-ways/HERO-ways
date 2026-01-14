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

import HomeIndex from "@/screens/home/index";
import TipsScreen from "@/screens/home/tips";

const Stack = createNativeStackNavigator();

const HomeScreen = ({ }) => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Home" component={HomeIndex} />
      {/* <Stack.Screen name="TipsOverview" component={TipsOverviewScreen} /> */}
      <Stack.Screen name="Tips" component={TipsScreen} />
    </Stack.Navigator>
  );
}

export default HomeScreen;