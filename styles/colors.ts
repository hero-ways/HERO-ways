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

type Theme =
  | "green"
  | "blueLight"
  | "blueDark"
  | "purple"
  | "red"
  | "white"
  | "black"
  | "blueDarkOpacity25"
  | "greenOpacity45"
  | "whiteOpacity50"

export const theme: Record<Theme, string> = {
  green: "#31B877",
  blueLight: "#59B9E5",
  blueDark: "#004C9A",
  purple: "#A241A7",
  red: "#E63B11",
  white: "#ffffff",
  black: "#000000",
  blueDarkOpacity25: "rgba(0, 76, 154, .25)",
  greenOpacity45: "rgba(49, 184, 119, .45)",
  whiteOpacity50: "rgba(255, 255, 255, .5)"
}

type GradientNavigation = "top" | "bottom"
export const gradientNavigation: Record<GradientNavigation, string> = {
  top: "#4C80B6",
  bottom: theme.blueDark
}
