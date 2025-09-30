import { createContext, useContext, type PropsWithChildren } from "react";
import { cliArguments, type CliArguments } from "./args";

type ArgumentContextType = CliArguments;

const ArgumentContext = createContext<ArgumentContextType>(cliArguments);

export const ArgumentContextProvider = ({ children }: PropsWithChildren) => {
    return (
        <ArgumentContext.Provider value={cliArguments}>
            {children}
        </ArgumentContext.Provider>
    );
};

export const useArguments = () => useContext(ArgumentContext);
