import { styled } from "@/stitches.config";
import { linkStyle } from "./Link";

const StyledLink = styled('a', linkStyle)

export default function LinkExternal({children, ...props}) {
    return <StyledLink {...props}>{children}</StyledLink>
}