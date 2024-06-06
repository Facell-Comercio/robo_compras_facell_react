import { FeedbackCapturaGN } from "./components/FeedbackCaptura"
import { ParametrosGN } from "./components/ParametrosGN"
import { TableCapturaGN } from "./components/table/Table"

export const CapturaGNPage = () => {
  return (
    <div className="max-h-[90vh] overflow-auto scroll-thin pb-5">
      <div className="grid grid-rows-[auto_auto] gap-3">
        <div className="grid grid-cols-[400px_1fr] gap-3">
          <ParametrosGN />
          <TableCapturaGN />
        </div>
        <div className="overflow-auto scroll-thin">
          <FeedbackCapturaGN />
        </div>
      </div>
    </div>
  )
}   