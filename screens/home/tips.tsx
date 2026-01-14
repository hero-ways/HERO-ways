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
import { useRoute } from "@react-navigation/native";
// import markdownEmbedPlugin from "markdown-it-block-embed";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import fs from "react-native-fs";
import Swiper from "react-native-swiper";
import Toast from "react-native-toast-message";

import { Colors, Slider } from "@/styles";
// import Background from "../assets/tipsBackground.svg";
import IconBack from "@/assets/images/icons/back.svg";
import IconBackpack from '@/assets/images/icons/backpack.svg';
import FileNames from "@/components/fileMapper";
import WebView from "react-native-webview";

type routeParams = {
  station: string, // clinic, home or rehab
  section: string, // info or tips from companions
  color: string
}

// const markdownItInstance = MarkdownIt({ typographer: true })
//   .use(markdownEmbedPlugin, {
//     containerClassName: "video-embed"
//   });

const storeData = async (filePath: string, station: string) => {
  let data: any = [];

  // Fetch existing backpack entries.
  try {
    const jsonValue = await AsyncStorage.getItem('HERO_APP-backpack');
    const json = jsonValue != null ? JSON.parse(jsonValue) : null;
    // Merge existing json data with new entries.
    data = [
      ...json,
      { station: station, filePath: filePath }
    ];
    // Remove duplicates.
    data = [...new Set(data.map((i: any) => JSON.stringify(i)))].map((i: any) => JSON.parse(i));
  } catch (error) {
    console.error('Unable to get data: ', error);
  }

  // Store updated entries into backpack.
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem('HERO_APP-backpack', jsonValue);
  } catch (error) {
    console.error('Unable to store data: ', error);
  }

  // debugAsyncStorage();
}

// Debug function to inspect AsyncStorage entries.
//
const debugAsyncStorage = () => {
  AsyncStorage.getAllKeys((err, keys) => {
    if (!keys?.length) return;
    AsyncStorage.multiGet(keys, (error, stores) => {
      stores?.map((result, i, store) => {
        console.log('Async Storage ... ', { [store[i][0]]: store[i][1] });
        return true;
      });
    });
  });
}

const TipScreen = ({ navigation }: any) => {
  const { t, i18n } = useTranslation();
  const route = useRoute();
  let sliderViews: React.ReactElement[] = [];

  const [pages, setPages] = useState(sliderViews);
  const [activeIconBackpack, setActiveIconBackpack] = useState(false);
  const params = route.params as routeParams;
  let webViewRef = useRef<WebView | null>(null);

  const tipsBackgroundImages: { [key: string]: any } = {
    clinic: require("@/assets/images/tipsClinicBackground.png"),
    home: require("@/assets/images/tipsHomeBackground.png"),
    rehab: require("@/assets/images/tipsRehabBackground.png")
  };

  const prepareSliderViews = (webViewRef: any) => {
    const files = FileNames as any;
    const promises: Promise<any>[] = [];

    // Iterate over the file list for each station (clinic, home and rehab).
    files[params.station][params.section].forEach((path: string) => {
      // First, read all data at once and then issue one final render.
      // Otherwise a sequential, individual file read would re-trigger a new render in the view.
      // promises.push(new Promise((resolve, reject) => {
      //   const filePath = `${params.station}/${i18n.language}/${path}`;

      //   fs.readFileAssets(filePath)
      //     .then(content => {
      //       const titleMatches = content.match(/\#\s(.*?)\n/); // Matches the first headline without the rhombus sign.
      //       const title = titleMatches?.length ? titleMatches[1] : '';
      //       const text = content.replace("# " + title + "\n\n", ""); // Remove the first headline from the rest of the text.

      //       resolve({
      //         title, text, filePath
      //       })
      //     })
      //     .catch(error => {
      //       console.error('Unable to read file: ', error);
      //       reject();
      //     });
      // }));
    });

    // Use `allSettled` instead of only `all` in order to proceed rendering of files, even if
    // some of them could not get loaded correctly and were therefore rejected.
    Promise.allSettled(
      promises
    ).then((data) => {
      const slides: React.ReactElement[] = [];

      data.forEach((item: any, index: number) => {
        if (item.status === 'fulfilled') {
          slides.push(
            <View style={styles.card} key={index}>
              <View style={[styles.cardTitleWrapper, { backgroundColor: params.color || Colors.theme.blueDark }]}>
                <Text style={styles.cardTitle}>{item.value.title}</Text>

                <TouchableOpacity
                  style={styles.cardTitleIcon}
                  onPress={() => {
                    setActiveIconBackpack(!activeIconBackpack);
                    // Trigger JavaScript function in WebView html.
                    webViewRef.injectJavaScript(`triggerHappyAnimation();`);
                    storeData(item.value.filePath, params.station);
                    Toast.show({
                      type: 'success',
                      text1: t('home.tips.tag'),
                      position: 'bottom',
                      bottomOffset: 0
                    });
                  }}
                >
                  <IconBackpack
                    width="24"
                    height="30"
                    color={activeIconBackpack ? Colors.theme.whiteOpacity50 : Colors.theme.white}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView contentInsetAdjustmentBehavior="automatic" >
                <View style={styles.cardBody}>
                  {/* <Markdown
                    markdownit={markdownItInstance}
                    children={`${item.value.text}`}
                    style={{ body: styles.markdownText, link: styles.markdownLink }}
                    rules={{
                      video: (node, children, parent, styles) => {
                        const imgSource = `https://img.youtube.com/vi/${node.sourceInfo.videoReference}/maxresdefault.jpg`;

                        return (
                          <ImageBackground key={node.key} source={{ uri: imgSource }} style={{ flex: 1, aspectRatio: 1 }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                              <TouchableOpacity onPress={() => {
                                Linking.openURL(`https://www.youtube.com/embed/${node.sourceInfo.videoReference}`);
                              }}>
                                <IconPlay width="50" height="50" />
                              </TouchableOpacity>
                            </View>
                          </ImageBackground>
                        );
                      }
                    }}
                  ></Markdown> */}
                </View>
              </ScrollView>
            </View>
          );
        }
      })

      setPages(slides);
    });
  }


  useEffect(() => {
    prepareSliderViews(webViewRef);
  }, []);


  return (
    // <Background width="100%" height="100%" style={styles.containerBackground} />
    <>
      <Image source={tipsBackgroundImages[params.station]} style={styles.containerImageBackground} />

      <View style={styles.container}>
        <View style={styles.slideContainer}>
          <View style={styles.titleWrapper}>
            <IconBack onPress={() => navigation.navigate('Home')} height="24" style={styles.backIcon} />
            <Text style={styles.title}>{t([`home.tips.${params.section}`])}</Text>
          </View>

          <View style={styles.slideWrapper}>
            <Swiper
              autoplay={false}
              showsButtons={true}
              loop={false}
              dotColor={Colors.theme.white}
              dotStyle={Slider.theme.dot}
              activeDotColor={Colors.theme.white}
              activeDotStyle={Slider.theme.activeDot}
              buttonWrapperStyle={Slider.theme.buttonWrapper}
              nextButton={<Text style={Slider.arrow.text}>›</Text>}
              prevButton={<Text style={Slider.arrow.text}>‹</Text>}
              renderPagination={(index, total, context) => {
                // @ts-ignore
                if (total < 10) return context.renderPagination();
                return <View style={Slider.theme.numberedPagination}><Text style={Slider.pagination.number}>{`${index + 1} / ${total}`}</Text></View>
              }}
            >
              {pages}
            </Swiper>
          </View>

        </View>
      </View>

      <View style={styles.spineContainerTips}>
        <WebView
          source={{ uri: 'file:///android_asset/animations/index.html' }}
          javaScriptEnabled={true}
          style={styles.webView}
          allowUniversalAccessFromFileURLs={true}
          // @ts-ignore
          ref={(r) => (webViewRef = r)}
        />
      </View>
    </>
  );
};

export default TipScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.theme.white,
    borderRadius: 30,
    marginHorizontal: 30,
    flex: 0.85,
    height: 60,
    paddingBottom: 15,
  },
  cardTitleWrapper: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  cardTitle: {
    color: Colors.theme.white,
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    paddingRight: 40
  },
  cardTitleIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  cardBody: {
    padding: 15
  },
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
    justifyContent: 'flex-start',
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
  markdownText: {
    fontSize: 18,
    color: Colors.theme.black,
    lineHeight: 20
  },
  markdownLink: {
    color: Colors.theme.blueDark
  },
  spineContainerTips: {
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: -50,
    right: 0,
    pointerEvents: 'none'
  },
  webView: {
    backgroundColor: 'transparent'
  },
});
