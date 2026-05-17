import { LeftColumn } from '@/components/layout/LeftColumn'
import { MiddleColumn } from '@/components/layout/MiddleColumn'
import { RightTray } from '@/components/layout/RightTray'

export function NowView() {
  return (
    <div className="layout">
      <LeftColumn />
      <div className="col-main">
        <MiddleColumn />
        <RightTray />
      </div>
    </div>
  )
}
