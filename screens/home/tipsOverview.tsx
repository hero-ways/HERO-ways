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

import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";

import "@/locales/index";
import { Buttons, Colors } from "@/styles";

import IconBack from "@/assets/images/icons/back.svg";
import IconNotes from "@/assets/images/icons/notes.svg";
import IconVideo from "@/assets/images/icons/video.svg";


type routeParams = {
  station: string,
  section: string,
  color: string
}

const TipsOverviewScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const route = useRoute();
  const params = route.params as routeParams;

  return (
    <>
      <Image source={require('@/assets/images/tipsBackground.png')} style={styles.containerImageBackground} />

      <View style={styles.container}>
        <View style={styles.slideContainer}>
          <View style={styles.titleWrapper}>
            <IconBack onPress={() => navigation.navigate('Home')} height="24" style={styles.backIcon} />
            <Text style={styles.title}>{t(`home.popups.titles.${params.station}`)}</Text>
          </View>

          <View style={styles.slideWrapper}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Tips', { color: params.color, station: params.station, section: 'tips' });
              }}
              style={[styles.buttonContainer, { backgroundColor: params.color || Colors.theme.blueDark, marginBottom: 14}]}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t('home.tipsOverview.tipsButton')}</Text>
              <IconVideo width="34" height="27"/>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Tips', { color: params.color, station: params.station, section: 'info' });
              }}
              style={[styles.buttonContainer, { backgroundColor: params.color || Colors.theme.blueDark }]}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t('home.tipsOverview.infoButton')}</Text>
              <IconNotes width="40" height="40"/>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.spineContainerTipsOverview}>
        <WebView
          source={{ uri: 'file:///android_asset/animations/index.html' }}
          javaScriptEnabled={true}
          style={styles.webView}
          allowUniversalAccessFromFileURLs={true}
        />
      </View>
    </>
  );
};

export default TipsOverviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  containerBackground: {
    position: 'absolute',
    zIndex: -1,
  },
  containerImageBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    zIndex: -1
  },
  slideContainer: {
    backgroundColor: "rgba(228, 236, 237, .6)",
    borderRadius: 30,
    width: '100%',
    height: '80%',
  },
  slideWrapper: {
    width: '100%',
    height: '80%',
    paddingBottom: 28
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  title: {
    color: Colors.theme.blueDark,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 23,
    textAlign: 'center',
  },
  backIcon: {
    paddingHorizontal: 20
  },
  markdownLink: {
    color: Colors.theme.blueDark
  },
  spineContainerTipsOverview: {
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: -50,
    right: 0,
  },
  webView: {
    backgroundColor: 'transparent'
  },
  buttonContainer: {
    ...Buttons.containers.regular,
    marginHorizontal: 36,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 8
  },
  buttonText: {
    ...Buttons.texts.regular,
    fontSize: 18,
    textTransform: 'none',
    textAlign: 'left',
    maxWidth: '80%'
  },
});