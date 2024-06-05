import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FeedbackItem } from "./FeedbackItem"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { Button } from "@/components/ui/button"


export const FeedbackCapturaGN = () => {
    const feedback = useStoreCapturaGN().feedback;
    const clearFeedback = useStoreCapturaGN().clearFeedback;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ScrollArea className="h-full">
                    {feedback.map((feedback, index)=>(
                        <FeedbackItem key={index} type={feedback.type} text={feedback.text} />
                    ))}
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <Button onClick={clearFeedback} size={'sm'}  variant={'secondary'}>Limpar</Button>
            </CardFooter>
        </Card>
    )
}