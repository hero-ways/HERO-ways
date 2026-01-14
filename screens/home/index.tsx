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
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import { WebView } from "react-native-webview";

import "@/locales/index";
import { Buttons, Colors } from "@/styles";

import Clinic from "@/assets/images/buildings/buildingClinic.svg";
import ClinicActive from "@/assets/images/buildings/buildingClinic_active.svg";
import Home from "@/assets/images/buildings/buildingHome.svg";
import HomeActive from "@/assets/images/buildings/buildingHome_active.svg";
import Rehab from "@/assets/images/buildings/buildingRehab.svg";
import RehabActive from "@/assets/images/buildings/buildingRehab_active.svg";
import Background from "@/assets/images/homeBackground.svg";

import IconNotes from "@/assets/images/icons/notes.svg";
import IconVideo from "@/assets/images/icons/video.svg";


const HomeIndex = ({ navigation }: any) => {
  const { t } = useTranslation();

  const [showPopover, setShowPopover] = useState({ clinic: false, home: false, rehab: false });
  const [currentBuilding, setCurrentBuilding] = useState<string>('start');
  const [buildingPosition, setBuildingPosition] = useState({ default: { x: -500, y: 250 } });
  const [animationPosition, SetAnimationPosition] = useState(new Animated.ValueXY({ x: buildingPosition.default.x, y: buildingPosition.default.y }));
  const [initialAnimation, setInitialAnimation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  let webViewRef = useRef<WebView | null>(null);
  let animatedStyle = {
    // Optionally use transform, which is supported with `useNativeDriver` set to true. Yet beware, that this
    // involves more complex position calculations using delta of hero object and selected station position.
    // transform: [ { transformX: animatedValue.x } ]
    left: animationPosition.x,
    top: animationPosition.y,
  }

  const setCurrentStation = async (station: string) => {
    try {
      await AsyncStorage.setItem('current-station', station);
      setCurrentBuilding(station);
    } catch (error) {
      console.error('Unable to store data: ', error);
    }
  }

  const getCurrentStation = async () => {
    try {
      const building = await AsyncStorage.getItem('current-station');
      // Set state after fetching data.
      if (building) {
        setCurrentBuilding(building);
      }
    } catch (error) {
      console.error('Unable to get data: ', error);
    }
  }

  const startAnimation = (station: string, jumpTo: boolean = false) => {
    const stationKey = station as keyof typeof buildingPosition;

    if (!buildingPosition[stationKey]) {
      return;
    }

    let newX = buildingPosition[stationKey].x;
    let newY = buildingPosition[stationKey].y;

    if (station === 'home') {
      newX = newX - 10;
      newY = newY - 20;
    }

    // Hero is already at the position of the current station.
    if (jumpTo) {
      SetAnimationPosition(new Animated.ValueXY({ x: newX, y: newY }));
    } else if (currentBuilding === station) {
      // The user clicks on the same building again. No need to animate.
      setShowPopover({ ...showPopover, [station]: true });
      setIsAnimating(false);
    } else {
      Animated.timing(animationPosition, {
        toValue: {
          x: newX,
          y: newY
        },
        duration: 2000,
        useNativeDriver: false
      }).start(() => {
        setShowPopover({ ...showPopover, [station]: true });
        setIsAnimating(false);
      });
    }
  }

  const getPosition = (event: LayoutChangeEvent, station: string) => {
    const layout = event.nativeEvent.layout;
    let xPosition = layout.x + layout.width;

    if (station === 'clinic') {
      xPosition = layout.x - layout.width + 30;
    }

    // NOTE: the following spread syntax doesn't work here. The state would change too
    // often which causes the buildingPosition not to be fully fetched. And this would cause
    // the hero character to disappear between page changes.
    // setBuildingPosition({
    //   ...buildingPosition,
    //   [station]: { x: xPosition, y: layout.y }
    // })
    const buildings = buildingPosition;
    buildings[station as keyof typeof buildingPosition] = { x: xPosition, y: layout.y }
    setBuildingPosition(buildings);

    if (Object.keys(buildingPosition).length === 5) {
      setInitialAnimation(!initialAnimation)
    }
  }

  const triggerAnimation = () => {
    // @ts-ignore
    webViewRef.injectJavaScript(`player.setAnimation("idle01");`)
  }

  useEffect(() => {
    getCurrentStation().then(() => {
      startAnimation(currentBuilding, true);
    });

  }, [initialAnimation]);

  return (
    <>
      <View style={styles.container}>
        <Background />
      </View>

      <Popover
        // backgroundStyle={{ backgroundColor: 'transparent' }}
        isVisible={showPopover.rehab}
        onRequestClose={() => setShowPopover((data) => ({ ...data, rehab: false }))}
        popoverStyle={{ borderRadius: 10, backgroundColor: Colors.theme.blueDark }}
        arrowSize={{ width: 24, height: 20 }}
        placement={PopoverPlacement.BOTTOM}
        from={(
          <TouchableOpacity
            style={styles.buildingRehabWrapper}
            disabled={isAnimating}
            onPress={() => {
              setIsAnimating(true);
              startAnimation('rehab');
              setCurrentStation('rehab');
            }}
            onLayout={(event) => getPosition(event, 'rehab')}
          >
            {currentBuilding === 'rehab' ? <RehabActive /> : <Rehab />}
          </TouchableOpacity>
        )}>

        <Text style={[styles.tooltipHeadline, { backgroundColor: Colors.theme.blueDark }]}>{t('home.popups.titles.rehab')}</Text>
        <View style={[{ padding: 10, width: 165, backgroundColor: Colors.theme.white }]}>
          <TouchableOpacity
            onPress={() => {
              setShowPopover((data) => ({ ...data, rehab: false }));
              navigation.navigate('Tips', { color: Colors.theme.blueDark, station: 'rehab', section: 'info' });
            }}
            style={[styles.blueButtonContainer, styles.iconButtonContainer, { marginBottom: 7 }]}
            activeOpacity={0.8}
          >
            <Text style={[Buttons.texts.regular, {marginRight: 10}]}>{t('home.popups.infoButton')}</Text>
            <IconNotes width="20" height="20"/>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowPopover((data) => ({ ...data, rehab: false }));
              navigation.navigate('Tips', { color: Colors.theme.blueDark, station: 'rehab', section: 'tips' });
            }}
            style={[styles.blueButtonContainer, styles.iconButtonContainer]}
            activeOpacity={0.8}>
            <Text style={[Buttons.texts.regular, {marginRight: 10}]}>{t('home.popups.videoButton')}</Text>
            <IconVideo width="25" height="20"/>
          </TouchableOpacity>
        </View>
      </Popover>

      <Popover
        isVisible={showPopover.home}
        onRequestClose={() => setShowPopover((data) => ({ ...data, home: false }))}
        popoverStyle={{ borderRadius: 10 }}
        arrowSize={{ width: 24, height: 20 }}
        placement={PopoverPlacement.TOP}
        from={(
          <TouchableOpacity
            style={styles.buildingHomeWrapper}
            disabled={isAnimating}
            onPress={() => {
              setIsAnimating(true);
              startAnimation('home');
              setCurrentStation('home');
            }}
            onLayout={(event) => getPosition(event, 'home')}
          >
            {currentBuilding === 'home' ? <HomeActive /> : <Home />}
          </TouchableOpacity>
        )}>

        <Text style={[styles.tooltipHeadline, { backgroundColor: Colors.theme.purple }]}>{t('home.popups.titles.home')}</Text>
        <View style={[{ padding: 10, width: 165 }]}>
          <TouchableOpacity
            onPress={() => {
              setShowPopover((data) => ({ ...data, home: false }));
              navigation.navigate('Tips', { color: Colors.theme.purple, station: 'home', section: 'info' });
            }}
            style={[styles.purpleButtonContainer, styles.iconButtonContainer, { marginBottom: 7 }]}
            activeOpacity={0.8}
          >
            <Text style={[Buttons.texts.regular, {marginRight: 10}]}>{t('home.popups.infoButton')}</Text>
            <IconNotes width="20" height="20"/>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowPopover((data) => ({ ...data, home: false }));
              navigation.navigate('Tips', { color: Colors.theme.purple, station: 'home', section: 'tips' });
            }}
            style={[styles.purpleButtonContainer, styles.iconButtonContainer]}
            activeOpacity={0.8}>
            <Text style={[Buttons.texts.regular, {marginRight: 10}]}>{t('home.popups.videoButton')}</Text>
            <IconVideo width="25" height="20"/>
          </TouchableOpacity>
        </View>
      </Popover>

      <Popover
        isVisible={showPopover.clinic}
        onRequestClose={() => setShowPopover((data) => ({ ...data, clinic: false }))}
        popoverStyle={{ borderRadius: 10 }}
        arrowSize={{ width: 24, height: 20 }}
        placement={PopoverPlacement.TOP}
        from={(
          <TouchableOpacity
            style={styles.buildingClinicWrapper}
            disabled={isAnimating}
            onPress={() => {
              setIsAnimating(true);
              startAnimation('clinic');
              setCurrentStation('clinic');
            }
            }
            onLayout={(event) => getPosition(event, 'clinic')}
          >
            {currentBuilding === 'clinic' ? <ClinicActive /> : <Clinic />}
          </TouchableOpacity>
        )}>

        <Text style={styles.tooltipHeadline}>{t('home.popups.titles.clinic')}</Text>
        <View style={[{ padding: 10, width: 165 }]}>
          <TouchableOpacity
            onPress={() => {
              setShowPopover((data) => ({ ...data, clinic: false }));
              navigation.navigate('Tips', { color: Colors.theme.red, station: 'clinic', section: 'info' });
            }}
            style={[styles.redButtonContainer, styles.iconButtonContainer, { marginBottom: 7 }]}
            activeOpacity={0.8}
          >
            <Text style={[Buttons.texts.regular, {marginRight: 10}]}>{t('home.popups.infoButton')}</Text>
            <IconNotes width="20" height="20"/>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowPopover((data) => ({ ...data, clinic: false }));
              navigation.navigate('Tips', { color: Colors.theme.red, station: 'clinic', section: 'tips' });
            }}
            style={[styles.redButtonContainer, styles.iconButtonContainer]}
            activeOpacity={0.8}>
            <Text style={[Buttons.texts.regular, {marginRight: 10}]}>{t('home.popups.videoButton')}</Text>
            <IconVideo width="25" height="20"/>
          </TouchableOpacity>
        </View>
      </Popover>

      <View
        style={styles.startWrapper}
        onLayout={(event) => getPosition(event, 'start')}
      />

      <Animated.View
        style={[styles.spineContainer, animatedStyle]}
      >
        <WebView
          source={{ uri: 'file:///android_asset/animations/index.html' }}
          javaScriptEnabled={true}
          style={[currentBuilding !== 'clinic' && currentBuilding != 'start' ? styles.webViewMirrored : styles.webView]}
          allowUniversalAccessFromFileURLs={true}
          // @ts-ignore
          ref={(r) => (webViewRef = r)}
          onLoad={triggerAnimation}
        />
      </Animated.View>
    </>
  );
};

export default HomeIndex;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.theme.greenOpacity45,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spineContainer: {
    width: 200,
    height: 130,
    position: 'absolute',
    pointerEvents: 'none'
  },
  webView: {
    backgroundColor: 'transparent',
  },
  webViewMirrored: {
    backgroundColor: 'transparent',
    transform: [
      { scaleX: -1 },
    ]
  },
  buildingRehabWrapper: {
    position: 'absolute',
    left: '1%',
    top: '4%'
  },
  buildingHomeWrapper: {
    position: 'absolute',
    left: '15%',
    top: '36%'
  },
  buildingClinicWrapper: {
    position: 'absolute',
    left: '40%',
    bottom: '20%'
  },
  startWrapper: {
    position: 'absolute',
    left: '10%',
    bottom: '20%'
  },
  tooltipHeadline: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.theme.white,
    backgroundColor: Colors.theme.red,
    paddingHorizontal: 30,
    paddingVertical: 10,
    textAlign: 'center'
  },
  iconButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redButtonContainer: {
    ...Buttons.containers.regular,
  },
  purpleButtonContainer: {
    ...Buttons.containers.regular,
    backgroundColor: Colors.theme.purple,
  },
  blueButtonContainer: {
    ...Buttons.containers.regular,
    backgroundColor: Colors.theme.blueDark,
  },
});