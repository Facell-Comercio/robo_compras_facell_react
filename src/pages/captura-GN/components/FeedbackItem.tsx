export type FeedbackItemProps = {
    text: string,
    type: 'error' | 'success' | 'info'
}
export const FeedbackItem = (props: FeedbackItemProps) => {
    let textColor = ''
    switch (props.type) {
        case 'error':
            textColor = 'text-destructive'
            break;
        case 'success':
            textColor = 'text-green-500'
            break;
        default:
            break;
    }
    return (
        <p className={`text-sm mb-2 ${textColor}`}>{props.text}</p>
    )
}