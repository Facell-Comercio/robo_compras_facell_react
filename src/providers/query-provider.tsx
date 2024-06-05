import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: false,  staleTime: 60000}
    }
});

type QueryClientProviderProps = {
    children: React.ReactNode;
}

const QueryClientProviderComponent: React.FC<QueryClientProviderProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
};

export default QueryClientProviderComponent;