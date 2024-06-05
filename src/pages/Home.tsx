import { Navbar } from "@/components/custom/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CapturaGNPage } from "./captura-GN/page";
import { NotasFiscaisPage } from "./notas-fiscais/page";
import { PedidosPage } from "./pedidos/page";
import { FaturadosPage } from "./faturados/page";

const Home = () => {
    return (<div className="grid gap-3 grid-cols-[calc(100%-50px)_40px] p-3 h-full w-full  ">
        <Tabs defaultValue="captura">
            <TabsList>
                <TabsTrigger value="captura">Captura GN</TabsTrigger>
                <TabsTrigger value="notas-fiscais">Notas Fiscais</TabsTrigger>
                <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
                <TabsTrigger value="faturados">Faturados</TabsTrigger>
            </TabsList>
            <TabsContent value="captura">
                <CapturaGNPage />
            </TabsContent>
            <TabsContent value="notas-fiscais">
                <NotasFiscaisPage />
            </TabsContent>
            <TabsContent value="pedidos">
                <PedidosPage />
            </TabsContent>
            <TabsContent value="faturados">
                <FaturadosPage />
            </TabsContent>
        </Tabs>

        <Navbar />
    </div>);
}

export default Home;