import { type OnCommandSubmit } from "./CommandLine";
import { useAppList } from "./ListContext";

const defCmd = (cmd: string, def: string, callback: (...args: string[]) => void) => {
    const c = cmd.split(' ')
    const diff = def.split(' ').map((item, i) => {
        if (c[i] === item) return "__MATCH__"  
        if (item === "_") return c[i]
        return "__DIFF__"
    })
    if (diff.includes("__DIFF__")) return;
    const args = diff
        .filter(item => item !== undefined)
        .filter(item => item !== '__MATCH__')
    callback(...args)
}

export const useCommands = () => {
    const { addList, rmList, addItem } = useAppList()

    const onRunCommand = (cmd: string) => {
        defCmd(cmd, "list add _", (arg) => {
             addList(arg)
        })
        defCmd(cmd, 'list rm _', (arg) => {
             rmList(arg)
        })
        defCmd(cmd, 'list add-item _', (arg) => {
             addItem(arg)
        })
    }

    const onSearch = (cmd: string) => {}

    const onReverseSearch = (cmd: string) => {} 

    const onSubmit: OnCommandSubmit = (mode, command) => {
        if (mode === 'search') onSearch(command)
        else if (mode === 'command') onRunCommand(command)
        else if (mode === 'r-search') onReverseSearch(command)
    }

    return { onSubmit }
}
