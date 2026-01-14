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

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { useTranslation } from 'react-i18next';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';
import Toast, { BaseToast } from 'react-native-toast-message';

import '@/locales/index';
import { Colors } from '@/styles';

import Header from '@/assets/images/header.svg';
import IconBackpack from '@/assets/images/icons/backpack.svg';
import IconInfo from '@/assets/images/icons/info.svg';
import IconMap from '@/assets/images/icons/map.svg';

import BackpackScreen from '@/screens/backpack';
import HomeScreen from '@/screens/home';
import InfoScreen from '@/screens/info';


const Tab = createBottomTabNavigator();

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.theme.green }}
      text1Style={{ fontSize: 16 }}
    />
  ),
};

export default function App() : React.JSX.Element {
  const { t } = useTranslation();

  const initAsyncStorage = async () => {
    // AsyncStorage.clear(); // For testing purposes only.

    try {
      // Initialize AsyncStorage with an empty array, if there is no data present yet.
      const data = await AsyncStorage.getItem('HERO_APP-backpack');
      if (data === null) {
        await AsyncStorage.setItem('HERO_APP-backpack', '[]');
      }
    } catch (error) {
      console.error('Unable to initialize AsyncStorage ', error);
    }
  }

  useEffect(() => {
    initAsyncStorage();
    // Increase the splash screen duration to 2 seconds.
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={Colors.theme.blueDark}
        barStyle={"dark-content"}
      />

        <Tab.Navigator
          initialRouteName="Info"
          screenOptions={{
            headerBackground: () => (
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
                <Defs>
                  <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0" stopColor={Colors.theme.blueDark} stopOpacity="1" />
                    <Stop offset="1" stopColor={Colors.theme.blueDark} stopOpacity="0.75" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)" />

                <View style={styles.headerContainer}>
                  <Header width="100%" height="100%" />
                </View>
              </Svg>
            ),
            headerTitleAlign: 'center',
            headerTintColor: Colors.theme.white,
            tabBarActiveTintColor: Colors.theme.white,
            tabBarInactiveTintColor: Colors.theme.whiteOpacity50,
            tabBarStyle: {
              height: 60,
              backgroundColor: Colors.theme.blueDark
            },
            tabBarLabelStyle: {
              fontSize: 14
            },
            tabBarBackground: () => (
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
                <Defs>
                  <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0" stopColor={Colors.gradientNavigation.top} />
                    <Stop offset="1" stopColor={Colors.gradientNavigation.bottom} />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)" />
              </Svg>
            ),
          }}>

          <Tab.Screen
            name="Overview"
            component={HomeScreen}
            options={{
              title: t('navigation.overview'),
              headerTitle: '',
              // unmountOnBlur: true,
              tabBarIcon: ({ size, focused, color }) => {
                return (
                  <IconMap color={focused ? Colors.theme.white : Colors.theme.whiteOpacity50} width={size} height={size} />
                );
              },
            }}
          />

          <Tab.Screen
            name="Backpack"
            component={BackpackScreen}
            options={{
              title: t('navigation.backpack'),
              headerTitle: '',
              // unmountOnBlur: true,
              tabBarIcon: ({ size, focused, color }) => {
                return (
                  <IconBackpack color={focused ? Colors.theme.white : Colors.theme.whiteOpacity50} width={size} height={size} />
                );
              },
            }}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                // In order to reset the station params for the backpack, we need to prevent the default behavior here.
                // Then set the params to `undefined` and finally trigger the navigation manually.
                event.preventDefault();
                navigation.setParams({ station: undefined });
                navigation.navigate('Backpack');
              }
            })}
          />

          <Tab.Screen
            name="Info"
            component={InfoScreen}
            options={{
              title: t('navigation.info'),
              headerTitle: '',
              // unmountOnBlur: true,
              tabBarIcon: ({ size, focused, color }) => {
                return (
                  <IconInfo color={focused ? Colors.theme.white : Colors.theme.whiteOpacity50} width={size} height={size} />
                );
              },
            }}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                // In order to pass parameters, we need to prevent the default behavior here.
                event.preventDefault();
                navigation.navigate('Info', { isInitial: false });
              }
            })}
          />

        </Tab.Navigator>
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent', // This is important, otherwise styles are not applied.
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});