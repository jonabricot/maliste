import { styled } from "@/stitches.config";

const StyledTitle = styled('p', {
    marginBottom: '.5em',
    variants: {
        type: {
            primary: {
                fontWeight: 'bold',
            }
        },
        size: {
            huge: {
                fontSize: '$huge',
            },
            big: {
                fontSize: '$big'
            },
            large: {
                fontSize: '$large'
            }
        },
    },
    defaultVariants: {
        type: 'primary',
        size: 'big'
    }
})

export default function Title({tag = 'h1', children, ...props}) {
    return <StyledTitle as={tag} {...props}>{children}</StyledTitle>
}