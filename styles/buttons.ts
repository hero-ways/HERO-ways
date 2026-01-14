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

import * as Colors from "@/styles/colors"
import { TextStyle, ViewStyle } from "react-native"

type Containers =
  | "regular"
  | "outline"
  | "notes"

export const containers: Record<Containers, ViewStyle> = {
  regular: {
    elevation: 0,
    backgroundColor: Colors.theme.red,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 12
  },
  outline: {
    elevation: 0,
    backgroundColor: Colors.theme.white,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.theme.red,
  },
  notes: {
    elevation: 0,
    backgroundColor: "rgba(228, 236, 237, .6)",
    padding: 14,
    borderRadius: 30,
  }
}

type Texts =
  | "regular"
  | "outline"
  | "notes"

export const texts: Record<Texts, TextStyle> = {
  regular: {
    color: Colors.theme.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  outline: {
    color: Colors.theme.red,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  notes: {
    color: Colors.theme.blueDark,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
}