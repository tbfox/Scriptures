import { Text } from "ink"
import TextInput from "ink-text-input"
import { useState } from "react"

type CommandMode = "goto" | null



type CommandLineProps = {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    mode: CommandMode
}

export const CommandLine = ({ mode,value, onChange, onSubmit}: CommandLineProps) => {
    if (mode === null) return <></>

    return <Text>Go to: <TextInput value={value} onChange={onChange} onSubmit={onSubmit} /></Text>
}

type UseCommandLineArgs = {}

type UseCommandLineResult = {
    setMode: (mode: CommandMode) => void
    mode: CommandMode
    bind: CommandLineProps
}

export const useCommandLine = (): UseCommandLineResult => {
    const [value, setValue] = useState('')
    const [mode, setMode] = useState<CommandMode>(null);

    const onSubmit = () => {
        setValue('')
        setMode(null)
    }

    return {
        setMode,
        mode,
        bind: {
            value,
            onChange: setValue,
            onSubmit,
            mode,
        }
    }
}
