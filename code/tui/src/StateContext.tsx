import { createContext, useContext, type PropsWithChildren } from "react";

type StateContextType = {
    lists: Map<string, string[]>
    addList: (listName: string, items: string[]) => void
    rmList: (listName: string) => void
    getCurrent: (listName: string) => void
    getNext: (listName: string) => void
    getPrev: (listName: string) => void
    getLastInList: (listName: string) => void
    getFirstInList: (listName: string) => void
    nextList: (listName: string) => void
    prevList: (listName: string) => void
}

const defaultStateContext = {
    lists: new Map(),
    addList: () => {},
    rmList: () => {},
    getCurrent: () => {},
    getNext: () => {},
    getPrev: () => {},
    getLastInList: () => {},
    getFirstInList: () => {},
    nextList: () => {},
    prevList: () => {},
} 

const StateContext = createContext<StateContextType>(defaultStateContext)

const useStateContextProvider = () => {

    return defaultStateContext
}

export const StateContextProvider = ({ children }: PropsWithChildren) => {
    const value = useStateContextProvider()
    return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

export const useAppState = () => useContext(StateContext)
