import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Header } from "./components/Header"
import { Table } from "./components/Table"

export const NotasFiscaisPage = () => {
  return (
    <Card>
            <CardHeader>
                <Header/>
            </CardHeader>
            <CardContent>
                <Table/>
            </CardContent>
        </Card>
  )
}