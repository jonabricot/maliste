import { styled } from "@/stitches.config";

const StyledParagraph = styled('p', {
    marginBottom: '.5em',
    variants: {
        size: {
            normal: {
                fontSize: '$normal',
            },
        },
    },
    defaultVariants: {
        size: 'normal'
    }
})

export default function Paragraph({ children, ...props}) {
    return <StyledParagraph {...props}>{children}</StyledParagraph>
}