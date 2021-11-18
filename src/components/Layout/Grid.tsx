import { styled } from "@/stitches.config";

const StyledGrid = styled('div', {
    $$columns: 2,
    display: 'grid',
    gap: '$normal',
    gridTemplateColumns: 'repeat($$columns, 1fr)',
    '@tablet': {
        $$columns: 4,
    },
    '@laptop': {
        $$columns: 8,
    },
    '@desktop': {
        $$columns: 12,
    },
    variants: {
        fluid: {
            true: {
                display: 'flex',
                flexWrap: 'wrap',
            }
        }
    }
})

export default function Grid({children, ...props}) {
    return <StyledGrid {...props}>{children}</StyledGrid>
}