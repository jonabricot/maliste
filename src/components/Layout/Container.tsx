import { breakpoints, styled } from "@/stitches.config";

let computedBreakpoints = {}
for (let key in breakpoints) {
    computedBreakpoints[`@${key}`] = {
        width: `calc(${breakpoints[key]} * 1.25)` 
    }
}

const StyledContainer = styled('div', {
    width: '100%',
    maxWidth: '100%',
    padding: '0 $normal',
    marginLeft: 'auto',
    marginRight: 'auto',
    ...computedBreakpoints
})

export default function Container({children, ...props}) {
    return <StyledContainer {...props}>{children}</StyledContainer>
}