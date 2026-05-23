import { NowView } from '@/components/views/NowView'
import { WhatView } from '@/components/views/WhatView'
import { WhoView } from '@/components/views/WhoView'
import { useCompassStore } from '@/store/useCompassStore'

export function ViewSlider() {
  const view = useCompassStore((s) => s.view)
  const slideDir = useCompassStore((s) => s.slideDir)

  const animClass = slideDir ? ` view-slide-${slideDir}` : ''

  return (
    <div className="view-slider">
      <div key={view} className={`view-slide${animClass}`}>
        {view === 'now' && <NowView />}
        {view === 'what' && <WhatView />}
        {view === 'who' && <WhoView />}
      </div>
    </div>
  )
}
