import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FeedbackItem } from "./FeedbackItem"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"


export const FeedbackCapturaGN = () => {
    const feedback = useStoreCapturaGN().feedback;
    const pushFeedback = useStoreCapturaGN().pushFeedback;
    const clearFeedback = useStoreCapturaGN().clearFeedback;

    useEffect(()=>{
        window.ipcRenderer.on('FEEDBACK-GN', (event: any, data: any) => {
            pushFeedback(data)
        })

        return () => {
            // @ts-ignore
            window.ipcRenderer.off('FEEDBACK-GN', () => { })
        }

    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px] max-h-[300px] overflow-auto grid grid-rows-[1fr_auto] gap-3">
                <ScrollArea className="flex-1 border">
                    {feedback.map((feedback, index)=>(
                        <FeedbackItem key={index} type={feedback.type} text={feedback.text} />
                    ))}
                </ScrollArea>
                <Button className="justify-self-start self-end" onClick={clearFeedback} size={'sm'}  variant={'secondary'}>Limpar</Button>
            </CardContent>
        </Card>
    )
}