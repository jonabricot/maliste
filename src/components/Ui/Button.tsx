import { styled } from "@/stitches.config"

const StyledButton = styled('button', {
    background: '$$background',
    color: '$$color',
    lineHeight: 1,
    border: 0,
    transition: 'all .3s ease',
    cursor: 'pointer',
    variants: {
        theme: {
            default: {
                $$background: '$colors$default',
                $$color: '$colors$text'
            },
            primary: {
                $$background: '$colors$primary',
                $$color: '$colors$text'
            },
            secondary: {
                $$background: '$colors$secondary',
                $$color: '$colors$text'
            },
            link: {
                $$background: 'transparent',
                $$color: 'inherit',
                textDecoration: 'underline'
            },
            danger: {
                $$background: '$colors$danger',
                $$color: '$colors$text'
            },
            success: {
                $$background: '$colors$success',
                $$color: '$colors$text'
            }
        },
        size: {
            normal: {
                fontSize: '$normal',
            },
            small: {
                fontSize: '$small'
            }
        },
        padding: {
            normal: {
                padding: '.5em 1em',
            },
            none: {
                padding: 0,
            }
        },
        disabled: {
            true: {
                opacity: 0.5,
            }
        },
        radius: {
            normal: {
                borderRadius: '$normal',
            },
            pill: {
                borderRadius: '9999px',
            }
        },
        weight: {
            normal: {
                fontWeight: '400',
            },
            bold: {
                fontWeight: 'bold',
            }
        }
    },
    defaultVariants: {
        theme: 'default',
        padding: 'normal',
        size: 'normal',
        radius: 'normal',
        weight: 'bold'
    }
})

export default function Button({children, ...props}) {
    return <StyledButton {...props}>{children}</StyledButton>
}