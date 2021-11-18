import { styled } from "@/stitches.config";
import Box from "@/components/Layout/Box";

const StyledCell = styled('div', {
    gridColumn: `span $$size`,
    variants: {
        fluid: {
            true: {
                gridColumn: '-1 / 1'
            }
        }
    }
})


export default function Cell({size = null, children, ...props}) {
    return <StyledCell css={{ $$size: size }} fluid={size === null} {...props}>{children}</StyledCell>
}