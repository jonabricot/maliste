import { styled } from '@/stitches.config'
import ReactDOM from 'react-dom'
import Card from '@/components/Ui/Card'
import { useEffect, useState } from 'react'
import Modal from './Modal'
import Title from '../Typography/Title'
import Grid from '../Layout/Grid'
import Cell from '../Layout/Cell'
import Button from './Button'
import UserService from '@/services/UserService'
import { client } from '@/data/client'

export default function ModalListProvider({id, open, onClose, ...props}) {
    const [providers, setProviders] = useState([])

    useEffect(async () => {
        const { data, error } = await client
            .from('list')
            .select()
            .eq('id', id)
            .single()
        if (data) {
            setProviders(data.providers)
        }
    }, [])

    function setProvider(value) {
        UserService.setProvider(id, value)
        onClose()
    }

    return <Modal open={open} onClose={onClose} {...props}>
        <Title size="big">Qui est-tu ?</Title>
        <Grid css={{ textAlign: 'center' }}>
            {providers.map((provider, index) => <Cell key={index}><Button theme="link" onClick={() => setProvider(provider)}>{provider}</Button></Cell>)}
        </Grid>
    </Modal>
}