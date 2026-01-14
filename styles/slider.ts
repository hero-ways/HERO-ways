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

import { TextStyle, ViewStyle } from "react-native"
import * as Colors from "./colors"

type Slider =
  | "dot"
  | "activeDot"
  | "buttonWrapper"
  | "numberedPagination"

export const theme: Record<Slider, ViewStyle> = {
  dot: {
    width: 6,
    height: 6,
    marginLeft: 12,
    marginRight: 12
  },
  activeDot: {
    width: 12,
    height: 12,
    marginLeft: 9,
    marginRight: 9,
    borderColor: Colors.theme.whiteOpacity50,
    borderWidth: 3,
    borderRadius: 12
  },
  buttonWrapper: {
    alignItems: 'flex-end',
  },
  numberedPagination: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
}

type Arrow =
  | "text"

export const arrow: Record<Arrow, TextStyle> = {
  text: {
    fontSize: 50,
    color: Colors.theme.white,
  },
}

type Pagination =
  | "number"

export const pagination: Record<Pagination, TextStyle> = {
  number: {
    color: Colors.theme.white,
    fontWeight: 'bold',
    fontSize: 16
  },
}
