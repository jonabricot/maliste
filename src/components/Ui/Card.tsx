import { styled } from "@/stitches.config"

const StyledCard = styled('div', {
    borderRadius: '$normal',
    background: '$$background',
    border: '1px solid $$background',
    transition: 'all .3s ease',
    variants: {
        theme: {
            normal: {
                $$background: '$colors$foreground'
            },
            active: {
                $$background: '$colors$active'
            }
        },
        shadow: {
            normal: {
                boxShadow: 'rgba(0, 0, 0, .2) $normal',
            }
        },
        padding: {
            normal: {
                padding: '$normal',
            },
            large: {
                padding: '$large'
            }
        },
    },
    defaultVariants: {
        theme: 'normal',
        padding: 'normal'
    }
})

export default function Card({children, ...props}) {
    return <StyledCard {...props}>{children}</StyledCard>
}