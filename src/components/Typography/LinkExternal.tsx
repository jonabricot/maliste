import { styled } from "@/stitches.config";
import { Link as ReactLink } from "react-router-dom"
import { linkStyle } from "./Link";

const StyledLink = styled('a', linkStyle)

export default function LinkExternal({children, ...props}) {
    return <StyledLink {...props}>{children}</StyledLink>
}