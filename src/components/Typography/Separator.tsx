import { styled } from "@/stitches.config";

const Separator = styled('div', {
    backgroundColor: '$text',
    opacity: 0.2,
    variants: {
        orientation: {
            horizontal: {
                width: '100%',
                height: '1px',
                margin: '$$spacing 0'
            },
        },
        size: {
            normal: {
                $$spacing: '$space$normal',
            }
        }
    },
    defaultVariants: {
        orientation: 'horizontal',
        size: 'normal'
    }
})

export default Separator