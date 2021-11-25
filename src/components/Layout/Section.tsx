import Box from "./Box";

export default function Section({type, children, ...props}) {
    return <Box as={type} {...props}>
        {children}
    </Box>
}