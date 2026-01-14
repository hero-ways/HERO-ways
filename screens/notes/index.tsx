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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRoute } from "@react-navigation/native";
// import markdownEmbedPlugin from "markdown-it-block-embed";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import fs from "react-native-fs";
import Swiper from "react-native-swiper";

import IconDelete from "@/assets/images/icons/delete.svg";
import IconPlus from "@/assets/images/icons/plus.svg";
import Background from "@/assets/images/roadBackground.svg";

import { deleteBackpackEntry, getAllBackpackEntries } from "@/services/backpackService";
import { deleteNote, getAllNotes } from "@/services/noteService";
import { Buttons, Colors, Slider } from "@/styles";



const getBackpackData = async () => {
  // Fetch existing backpack entries.
  try {
    const jsonValue = await AsyncStorage.getItem('HERO_APP-backpack');
    const json = jsonValue != null ? JSON.parse(jsonValue) : null;
    return json;
  } catch (error) {
    console.error('Unable to get data: ', error);
    return;
  }
}

// const markdownItInstance = MarkdownIt({ typographer: true })
//   .use(markdownEmbedPlugin, {
//     containerClassName: "video-embed"
//   });

const stationColors: Record<string, string> = {
  clinic: Colors.theme.red,
  home: Colors.theme.purple,
  rehab: Colors.theme.blueDark
}

type routeParams = {
  station: string,
}

const BackpackIndex = ({ navigation }: any) => {
  const { t } = useTranslation();
  const sliderViews: React.ReactElement[] = [];
  const [pages, setPages] = useState(sliderViews);
  const [initialPages, setInitialPages] = useState(sliderViews);
  const [activeStation, setActiveStation] = useState('');

  const route = useRoute();
  const params = route.params as routeParams;

  const filterPages = (station: string) => {
    if (station === '') {
      setActiveStation('');
      return setPages(initialPages);
    }

    const selectedSlides = initialPages.filter((obj: any) => obj.station === station);
    setPages(selectedSlides);
  }

  const handleDelete = async (item: any) => {
    Alert.alert(
      t('backpack.deleteAlert.title'),
      t('backpack.deleteAlert.text'),
      [
        {
          text: t('general.cancel'),
        },
        {
          text: t('general.ok'),
          onPress: async () => {
            item.value.id ? await deleteNote(item.value.id) : await deleteBackpackEntry(item.value.entry.filePath);
            prepareSliderViews();
            filterPages('');
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const prepareSliderViews = async () => {
    // Reset promises each time the function is called.
    const promises: Promise<any>[] = [];
    // First, fetch all tagged markdown files from AsyncStorage.
    const data = await getAllBackpackEntries();
    // Fetch all stored notes from AsyncStorage,
    const allNotes = await getAllNotes();
    allNotes.forEach((item: any) => {
      promises.push(Promise.resolve(item))
    });

    // Iterate over all data from the backpack.
    data.forEach((entry: { filePath: string; station: string; }) => {
      // First, read all data at once and then issue one final render.
      // Otherwise a sequential, individual file read would re-trigger a new render in the view.
      // promises.push(new Promise((resolve, reject) => {
      //   fs.readFileAssets(entry.filePath)
      //     .then(content => {
      //       const titleMatches = content.match(/\#\s(.*?)\n/); // Matches the first headline without the rhombus sign.
      //       const title = titleMatches?.length ? titleMatches[1] : '';
      //       const text = content.replace("# " + title + "\n\n", ""); // Remove the first headline from the rest of the text.

      //       resolve({ title, text, entry });
      //     })
      //     .catch(error => {
      //       console.error('Unable to read file: ', error);
      //       reject();
      //     });
      // }))
    });

    // Use `allSettled` instead of only `all` in order to proceed rendering of files, even if
    // some of them could not get loaded correctly and were therefore rejected.
    Promise.allSettled(
      promises
    ).then((data) => {
      const slides: any[] = [];

      data.forEach((item: any, index: number) => {
        if (item.status === 'fulfilled') {
          const station = (item.value.id) ? item.value.station : item.value.entry.station;
          // Create an object with station and the according view in order to filter later on.
          const slide: { station: string, view: React.ReactElement } = {
            station: station,
            view: (
              <View style={styles.card} key={index}>
                <View style={[styles.cardTitleWrapper, { backgroundColor: stationColors[station] || Colors.theme.blueDark }]}>
                  <Text style={styles.cardTitle}>{item.value.title}</Text>
                  <TouchableOpacity
                    onPress={async () => handleDelete(item)}
                    style={styles.deleteIcon}
                    activeOpacity={0.8}
                  >
                    <IconDelete width="17" height="20" />
                  </TouchableOpacity>
                </View>

                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.cardBody}>
                  <View style={styles.cardBody}>
                    {/* <Markdown
                      markdownit={markdownItInstance}
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
                    >${item.value.text}</Markdown> */}
                  </View>
                </ScrollView>
              </View>
            )
          };

          slides.push(slide);
        }
      });

      // To render the slides, we need to fetch the view property from the slides.
      // Here, all slides are fetched for the initial rendering.
      // In order to preserve the initialPages, a separate state is used. Otherwise
      // the filters would decrease the pages and switching stations wouldn't be possible.
      setInitialPages(slides);

      if (params?.station) {
        setActiveStation(params.station);
      } else {
        setPages(slides);
      }
    });
  }

  useEffect(() => {
    filterPages(activeStation);
  }, [activeStation]);

  // Triggered on each page visit.
  // Necessary for newly added notes to appear instantly in swiper.
  useFocusEffect(
    useCallback(() => {
      prepareSliderViews();
    }, [])
  );

  return (
    <>
      <Background width="100%" height="100%" style={styles.background} />
      <View style={styles.backgroundContainer}>

        <Text style={styles.title}>{t('backpack.title')}</Text>

        <View style={styles.slideContainer}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, marginHorizontal: 10 }}>
            <TouchableOpacity
              onPress={() =>
                activeStation === 'clinic' ? setActiveStation('') : setActiveStation('clinic')
              }
              style={[styles.buttonStationContainer, { backgroundColor: activeStation === 'clinic' ? Colors.theme.red : 'transparent' }]}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.buttonStationText, { color: activeStation === 'clinic' ? Colors.theme.white : Colors.theme.red }]}
              >{t('home.popups.titles.clinic')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                activeStation === 'home' ? setActiveStation('') : setActiveStation('home')
              }
              style={[styles.buttonStationContainer, { borderColor: Colors.theme.purple, backgroundColor: activeStation === 'home' ? Colors.theme.purple : 'transparent' }]}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.buttonStationText, { color: activeStation === 'home' ? Colors.theme.white : Colors.theme.purple }]}
              >{t('home.popups.titles.home')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                activeStation === 'rehab' ? setActiveStation('') : setActiveStation('rehab')
              }
              style={[styles.buttonStationContainer, { borderColor: Colors.theme.blueDark, backgroundColor: activeStation === 'rehab' ? Colors.theme.blueDark : 'transparent' }]}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.buttonStationText, { color: activeStation === 'rehab' ? Colors.theme.white : Colors.theme.blueDark }]}
              >{t('home.popups.titles.rehab')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.slideWrapper}>
            <Swiper
              key={+new Date()}
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
              {pages?.length !== 0 ? pages.map((x: any) => x.view) : <Text style={{ textAlign: 'center', color: Colors.theme.blueDark }}>{t('backpack.noData')}</Text>}
            </Swiper>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddNote', { id: undefined });
              setActiveStation('');
            }}
            style={[styles.buttonContainer, styles.buttonContainerWithIcon]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t('notes.newNote')}</Text>
            <IconPlus />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Overview')}
            style={styles.buttonContainer}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t('general.back')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default BackpackIndex;

const styles = StyleSheet.create({
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
  slideWrapper: {
    flexGrow: 1
  },
  title: {
    color: Colors.theme.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 23,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
  },
  card: {
    backgroundColor: Colors.theme.white,
    borderRadius: 30,
    marginHorizontal: 20,
    flex: 0.85,
    height: 60,
    paddingBottom: 15,
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
  },
  cardBody: {
    padding: 10
  },
  markdownText: {
    fontSize: 18,
    color: Colors.theme.black,
    lineHeight: 20
  },
  markdownLink: {
    color: Colors.theme.blueDark
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
  buttonContainerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%'
  },
  buttonText: {
    ...Buttons.texts.notes,
  },
  buttonStationContainer: {
    ...Buttons.containers.outline,
    backgroundColor: 'transparent',
    borderWidth: 2
  },
  buttonStationText: {
    ...Buttons.texts.outline,
    textTransform: 'none',
  },
  deleteIcon: {
    position: 'absolute',
    top: 22,
    right: 20
  }
});