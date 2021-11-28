import { Link as ReactLink } from 'react-router-dom'
import { styled } from "@/stitches.config";
import Link from "@/components/Typography/Link"

const StyledLink = styled(ReactLink, {
    color: '$normal',
    display: 'inline-flex'
})

export default function LinkInternal({to, children, linkProps = {}, ...props}) {
    return <StyledLink to={to} {...props}>
        <Link as="span" {...linkProps}>{children}</Link>
    </StyledLink>
}