import { keyframes, styled } from "@/stitches.config"
import { DotFilledIcon } from "@radix-ui/react-icons"
import Button from "./Button"

const StyledButtonLoading = styled(Button, {
    position: 'relative'
})

const StyledContent = styled('span', {
    display: 'inline-block',
    transition: 'all .3s ease',
    variants: {
        loading: {
            true: {
                opacity: 0,
                transform: 'translateY(10px)',
            }
        }
    }
})

const rotate = keyframes({
    'from': { transform: 'rotate(0deg)' },
    'to': { transform: 'rotate(360deg)' },
});

const appear = keyframes({
    '0%': { opacity: '0', transform: 'scale(0.5)' },
    '33%': { opacity: '1', transform: 'scale(1)' },
    '66%': { opacity: '1', transform: 'scale(1)' },
    '100%': { opacity: '0', transform: 'scale(0.5)' }
});

const StyledLoader = styled('div', {
    $$offset: '10px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transition: 'all .3s ease',
    transform: 'translate(-50%, calc(-50% + $$offset))',
    pointerEvents: 'none',
    display: 'flex',
    gap: '$$offset',
    opacity: 0,
    variants: {
        loading: {
            true: {
                $$offset: '0px',
                opacity: 1,
            }
        }
    }
})

const LoadingIcon = styled(DotFilledIcon, {
    animation: `${appear} ease infinite 1s`,
    variants: {
        position: {
            second: {
                animationDelay: '.2s'
            },
            third: {
                animationDelay: '.4s'
            }
        }
    }
})

export default function ButtonLoading({loading = false, children, ...props}) {
    return <StyledButtonLoading disabled={loading} {...props}>
        <StyledContent loading={loading}>{children}</StyledContent>
        <StyledLoader loading={loading}>
            <LoadingIcon />
            <LoadingIcon position='second' />
            <LoadingIcon position='third' />
        </StyledLoader>
    </StyledButtonLoading>
}