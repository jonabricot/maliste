import { styled } from '@/stitches.config'
import ReactDOM from 'react-dom'
import Card from '@/components/Ui/Card'
import { useEffect, useState } from 'react'

const StyledLoadingOverlay = styled('div', {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'all .3s ease',
    variants: {
        loading: {
            true: {
                pointerEvents: 'all',
                opacity: 1
            }
        }
    }
})

const StyledLoadingBackground = styled('div', {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
}) 

const StyledLoader = styled(Card, {
    position: 'relative',
    zIndex: 1,
    transition: 'all .3s ease',
    transform: 'translateY(10px)',
    variants: {
        open: {
            true: {
                transform: 'translateY(0)'
            }
        }
    }
})

export default function Loading({loading}) {
    return <StyledLoadingOverlay loading={loading}>
        <StyledLoadingBackground />
    </StyledLoadingOverlay>
}