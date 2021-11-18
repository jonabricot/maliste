import { styled } from '@/stitches.config'
import ReactDOM from 'react-dom'
import Card from '@/components/Ui/Card'
import { useEffect, useState } from 'react'

const StyledModalWrapper = styled('div', {
    position: 'fixed',
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
        open: {
            true: {
                pointerEvents: 'all',
                opacity: 1
            }
        }
    }
})

const StyledModalBackground = styled('div', {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
}) 

const StyledModalCard = styled(Card, {
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
    },
})

export default function Modal({open, onClose, children}) {
    return ReactDOM.createPortal(
        <StyledModalWrapper open={open}>
            <StyledModalBackground onClick={onClose} />
            <StyledModalCard open={open} padding="large">{children}</StyledModalCard>
        </StyledModalWrapper>
    , document.body)
}