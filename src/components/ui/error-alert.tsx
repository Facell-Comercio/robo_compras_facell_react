import { AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "./alert";

const ErrorAlert = ({ message }: {message: string}) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className='text-left'>Erro</AlertTitle>
      <AlertDescription className='text-left'>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
