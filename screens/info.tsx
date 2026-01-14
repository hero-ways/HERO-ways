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

/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text } from "react-native";
// import fs from "react-native-fs";
import Markdown from "react-native-markdown-display";

import Background from "@/assets/images/roadBackground.svg";
import packageJson from '@/package.json';
import { Colors } from "@/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

type routeParams = {
  isInitial: boolean,
}

const InfoScreen = ({ }) => {
  const { t, i18n } = useTranslation();
  const [fileData, setFileData] = useState(Object);
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as routeParams;


  const readFile = async (path: string) => {
    // Returns the filename from a given full path without file extension.
    const fileName = path?.split('/')?.pop()?.split('.')[0];
    if (fileName === undefined) {
      return;
    }

    // if (Platform.OS == 'android') {
    //   fs.readFileAssets(path)
    //     .then(binary => {
    //       setFileData((fileData: object) => ({
    //         ...fileData,
    //         [fileName]: binary
    //       }));
    //     })
    //     .catch(error =>
    //       console.error('Unable to read file :', error)
    //     );
    // } else if (Platform.OS == 'ios') {
    //   fs.readFile(`${fs.MainBundlePath}/assets/${path}`)
    //     .then(binary => {
    //       setFileData((fileData: object) => ({
    //         ...fileData,
    //         [fileName]: binary
    //       }));
    //     })
    //     .catch(error =>
    //       console.error('Unable to read file :', error)
    //     );
    // }
  };


  const checkInitialStartup = async (navigation: any) => {
    // Only load info text if the user has not seen the info screen yet (on first App startup) or
    // if the user explicitly navigates to the info screen.
    if (params?.isInitial === undefined) {
      const hasSeenInfo = await AsyncStorage.getItem('hasSeenInfo');

      if (hasSeenInfo === 'true') {
        navigation.navigate('Overview');
        return false;
      }

      await AsyncStorage.setItem('hasSeenInfo', 'true');
    }

    return true;
  }


  useEffect(() => {
    checkInitialStartup(navigation).then((result) => {
      if (result) {
        readFile(`info_screen/${i18n.language}/general.md`);
        readFile(`info_screen/${i18n.language}/navigation.md`);
      }
    });
  }, []);

  return (
    <>
      <Background width="100%" height="100%" style={styles.containerBackground} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>

          <Text style={styles.title}>{t('info.titles.general')}</Text>
          {fileData?.general && <Markdown children={`${fileData.general}`} style={{ body: styles.markdownText, link: styles.markdownLink }}></Markdown>}

          <Text style={[styles.title, { marginTop: 32 }]}>{t('info.titles.navigation')}</Text>
          {fileData?.navigation && <Markdown children={fileData.navigation} style={{ body: styles.markdownText }}></Markdown>}
          <Text style={styles.title}>{t('info.titles.general')}</Text>
          {/* {fileData?.general && <Markdown style={{ body: styles.markdownText, link: styles.markdownLink }}>{`${fileData.general}`}</Markdown>}

          <Text style={[styles.title, { marginTop: 32 }]}>{t('info.titles.navigation')}</Text>
          {fileData?.navigation && <Markdown style={{ body: styles.markdownText }}>{fileData.navigation}</Markdown>} */}

          <Text style={styles.versionNumber}>{packageJson.version}</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default InfoScreen;

const styles = StyleSheet.create({
  containerBackground: {
    position: 'absolute',
    zIndex: -1
  },
  container: {
    flex: 1,
    backgroundColor: Colors.theme.blueDarkOpacity25,
    padding: 28
  },
  scrollView: {
    backgroundColor: Colors.theme.white,
    borderRadius: 5,
    height: '100%',
    paddingHorizontal: 24,
  },
  title: {
    color: Colors.theme.blueDark,
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  markdownText: {
    fontSize: 18,
    color: Colors.theme.black,
    lineHeight: 20
  },
  markdownLink: {
    color: Colors.theme.blueDark
  },
  versionNumber: {
    fontSize: 10,
    color: Colors.theme.black,
    lineHeight: 20,
    textAlign: 'right',
    marginBottom: 16
  }
});
