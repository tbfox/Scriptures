import { render } from "ink";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ArgumentContextProvider } from "./src/ArgumentContext";
import { Main } from "./src/Main";
import { Log } from "./src/Logger";

process.stdout.write(`\x1b[2J`) // clear screen
process.stdout.write(`\x1b[H`)  // cursor home

const queryClient = new QueryClient();

const App = () => {
    Log.render(App)
    return (
        <QueryClientProvider client={queryClient}>
            <ArgumentContextProvider>
                <Main />
            </ArgumentContextProvider>
        </QueryClientProvider>
    );
};

Log.info('Starting App...')
render(<App />);
