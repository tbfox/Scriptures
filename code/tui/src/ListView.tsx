import { Box, Text } from "ink"
import { useAppList } from "./ListContext"

export const ListView = () => {
    const { lists } = useAppList()
    return (
        <Box width={80}>
            <Text color='blue'>[</Text>
            {lists.map(({ key, items, isSelected, selectedItem }) => {
                let color = 'whiteBright'
                if (isSelected) {
                    if (items.length === 0) {
                        color = 'green'
                    } else {
                        color = 'greenBright'
                    }
                }
                return (
                    <Box key={key}>
                        <Text color={color}>
                            {` ${key}`}
                        </Text>
                        <Text>
                            {`${items.length === 0 ? "()": `(${isSelected ? `${selectedItem+1}/` : ""}${items.length})`}`}
                        </Text>
                    </Box>
                )
            })}
            <Text color='blue'> ]</Text>
        </Box>
    )
}
