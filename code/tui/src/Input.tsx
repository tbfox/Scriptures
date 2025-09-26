import { Text } from "ink"
import TextInput from "ink-text-input"
import { useState } from "react"

type CommandMode = "command" | "search" | "r-search" | null

type CommandLineProps = {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    mode: CommandMode
}

export const CommandLine = ({ mode, value, onChange, onSubmit}: CommandLineProps) => {
    if (mode === null) return <></>
    let label = ":"
    if (mode === 'search') label = '/'
    if (mode === 'r-search') label = '?'
    return <Text>{label}<TextInput value={value} onChange={onChange} onSubmit={onSubmit} /></Text>
}

export type UseCommandLineResult = {
    cmd: () => void
    search: () => void
    reverseSearch: () => void
    exit: () => void
    isActive: boolean
    bind: CommandLineProps
}

export const useCommandLine = (): UseCommandLineResult => {
    const [value, setValue] = useState('')
    const [mode, setMode] = useState<CommandMode>(null);

    const exit = () => {
        setValue('')
        setMode(null)
    }

    return {
        cmd: () => setMode('command'),
        search: () => setMode('search'),
        reverseSearch: () => setMode('r-search'),
        exit,
        isActive: mode !== null,
        bind: {
            value,
            onChange: setValue,
            onSubmit: exit,
            mode,
        }
    }
}
