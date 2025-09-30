import {
    createContext,
    useContext,
    useState,
    type PropsWithChildren,
} from "react";

type RefList = {
    key: string;
    items: string[];
    isSelected: boolean;
    selectedItem: number;
};

type ListMap = Map<string, string[]>;

type ListContextType = {
    lists: RefList[];
    currentList: number;
    currentItem: number;
    addList: (listName: string) => void;
    rmList: (listName: string) => void;
    selectList: (listName: string) => void;
    addItem: (path: string) => void;
    current: () => string | null;
    next: () => string | null;
    prev: () => string | null;
    goToLastInList: () => void;
    goToFirstInList: () => void;
    nextList: () => void;
    prevList: () => void;
};

const defaultListContext: ListContextType = {
    lists: [],
    currentList: 0,
    currentItem: 0,
    addList: () => {},
    rmList: () => {},
    addItem: () => {},
    current: () => "",
    next: () => "",
    prev: () => "",
    goToLastInList: () => {},
    goToFirstInList: () => {},
    nextList: () => {},
    prevList: () => {},
    selectList: () => {},
};

const ListContext = createContext<ListContextType>(defaultListContext);

const useListContextProvider = (): ListContextType => {
    const [lists, setLists] = useState<ListMap>(new Map([]));
    const [currentList, setCurrentList] = useState<number>(0);
    const [currentItem, setCurrentItem] = useState<number>(0);

    const getListName = () => {
        return Array.from(lists.keys())[currentList] || "";
    };

    const addList = (listName: string) =>
        setLists((map) => {
            if (!map.has(listName)) {
                map.set(listName, []);
                setCurrentList(Array.from(map.keys()).indexOf(listName));
            }

            return new Map(map);
        });

    const rmList = (listName: string) =>
        setLists((map) => {
            if (map.has(listName)) map.delete(listName);
            return new Map(map);
        });

    const addItem = (nameArg: string | null = null, path: string) =>
        setLists((map) => {
            const name = nameArg === null ? getListName() : nameArg;
            if (name === "") return map;
            const l = map.get(name) || [];
            if (!l.includes(path)) map.set(name, [...l, path]);
            return new Map(map);
        });

    const current = (): string | null => {
        const name = getListName();
        const list = lists.get(name);
        if (list === undefined) return null;
        return list[currentItem] || null;
    };

    const next = (): string | null => {
        const name = getListName();
        const list = lists.get(name);
        if (list === undefined) return null;
        if (currentItem < list.length - 1) {
            const ret = list[currentItem + 1];
            setCurrentItem((i) => i + 1);
            return ret || null;
        }
        return list[currentItem] || null;
    };

    const prev = (): string | null => {
        const name = getListName();
        const list = lists.get(name);
        if (list === undefined) return null;
        if (currentItem > 0) {
            const ret = list[currentItem - 1];
            setCurrentItem((i) => i - 1);
            return ret || null;
        }
        return list[currentItem] || null;
    };

    const nextList = () => {
        if (currentList < lists.size - 1) {
            setCurrentList((i) => i + 1);
            setCurrentItem(0);
        }
    };

    const prevList = () => {
        if (currentList > 0) {
            setCurrentList((i) => i - 1);
            setCurrentItem(0);
        }
    };

    const selectList = (listName: string) => {
        const list = Array.from(lists.keys());
        setCurrentList(list.indexOf(listName));
    };

    const goToLastInList = () => {
        const list = lists.get(getListName());
        if (list === undefined) return;
        setCurrentItem(list.length - 1);
    };

    const goToFirstInList = () => {
        setCurrentItem(0);
    };

    return {
        lists: Array.from(lists.entries()).map(
            ([key, value], i): RefList => ({
                key,
                items: value,
                isSelected: i === currentList,
                selectedItem: currentItem,
            }),
        ),
        currentList,
        currentItem,
        addItem,
        addList,
        rmList,
        current,
        next,
        prev,
        goToLastInList,
        goToFirstInList,
        nextList,
        prevList,
        selectList,
    };
};

export const ListContextProvider = ({ children }: PropsWithChildren) => {
    const value = useListContextProvider();
    return (
        <ListContext.Provider value={value}>{children}</ListContext.Provider>
    );
};

export const useAppList = () => useContext(ListContext);
