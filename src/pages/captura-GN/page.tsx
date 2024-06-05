import { FeedbackCapturaGN } from "./components/FeedbackCaptura"
import { ParametrosGN } from "./components/ParametrosGN"

export const CapturaGNPage = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <ParametrosGN/>
      <FeedbackCapturaGN/>
    </div>
  )
}   