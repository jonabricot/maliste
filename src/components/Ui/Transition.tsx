import { styled } from "@/stitches.config";
import { useEffect } from "react";
import useTransition from "react-transition-state";


const SlidingElement = styled('div', {
    transition: 'all .3s ease',
    variants: {
        state: {
            entered: {
                opacity: 1,
                transform: 'translateY(0)',
                pointerEvents: 'all'
            },
            exited: {
                opacity: 0,
                transform: 'translateY(1rem)',
                pointerEvents: 'none'
            },
        }
    }
})

export function Transition({animate = true, children, ...props}) {
    const [state, toggle] = useTransition({ timeout: 0 })

    useEffect(() => {
        toggle(animate)
    }, [animate])

    return <SlidingElement state={state} {...props}>{children}</SlidingElement>
}