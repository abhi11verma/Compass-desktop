import { useEffect, useState } from 'react'

import {
  checkIsIOS,
  checkIsStandalone,
  getInstallState,
  subscribeInstall,
} from '@/lib/pwaInstall'

export function usePwaInstall() {
  const [state, setState] = useState(getInstallState)

  useEffect(() => subscribeInstall(() => { setState(getInstallState()) }), [])

  return {
    ...state,
    isIOS: checkIsIOS(),
    isInstalled: checkIsStandalone(),
  }
}
