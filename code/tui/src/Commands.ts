import { type OnCommandSubmit } from "./Input";

export const useCommands = () => {
    
    const onRunCommand = (cmd: string) => {
    
    } 
    const onSearch = (cmd: string) => {

    } 
    const onReverseSearch = (cmd: string) => {
    
    } 

    const onSubmit: OnCommandSubmit = (mode, command) => {
        if (mode === 'search') onSearch(command)
        else if (mode === 'command') onRunCommand(command)
        else if (mode === 'r-search') onReverseSearch(command)
    }

    return { onSubmit }
}
