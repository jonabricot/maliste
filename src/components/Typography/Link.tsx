import { styled } from "@/stitches.config";
import { Link as ReactLink } from "react-router-dom"

export const linkStyle = {
    color: '$normal',
    textDecoration: 'underline',
    cursor: 'pointer',
    variants: {
        muted: {
            true: {
                opacity: 0.5
            }
        }
    }
}

const StyledLink = styled(ReactLink, linkStyle)

export default function Link({children, ...props}) {
    return <StyledLink {...props}>{children}</StyledLink>
}