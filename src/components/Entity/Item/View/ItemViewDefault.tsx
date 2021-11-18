import React, { useEffect } from 'react'
import { useState } from "react"
import { EntityListItem } from '@/types/app'
import Card from '@/components/Ui/Card'
import Link from '@/components/Typography/Link'
import Button from '@/components/Ui/Button'
import Grid from '@/components/Layout/Grid'
import Cell from '@/components/Layout/Cell'
import { client } from '@/data/client'
import UserService from '@/services/UserService'
import Loading from '@/components/Ui/Loading'
import ButtonLoading from '@/components/Ui/ButtonLoading'
import ModalListProvider from '@/components/Ui/ModalListProvider'
import LinkExternal from '@/components/Typography/LinkExternal'
import Separator from '@/components/Typography/Separator'
import Box from '@/components/Layout/Box'

type EntityListProps = {
    entity: EntityListItem, 
    onProvider: Function,
    forceProvider: boolean
}


export default function ItemViewDefault({ entity, onProvider, forceProvider = false }: EntityListProps) {
    const [loading, setLoading] = useState(false)
    const [displayProvider, setDisplayProvider] = useState(false)
    const [localEntity, setLocalEntity] = useState(entity)

    useEffect(() => {
        if (forceProvider) {
            attachProvider()
        }
    }, [forceProvider])

    async function attachProvider() {
        if (!UserService.hasProvider(localEntity.list_id)) {
            onProvider()
            return
        }

        setLoading(true)
        let result = await client
            .from('item')
            .update([
                { provider: UserService.getProvider(localEntity.list_id) }
            ])
            .eq('id', localEntity.id)
        
        if (result.data && result.data.length > 0) {
            setLocalEntity(result.data[0])
        }
        setLoading(false)
    }

    async function removeProvider() {
        setLoading(true)
        let result = await client
            .from('item')
            .update([
                { provider: null }
            ])
            .eq('id', localEntity.id)

        if (result.data && result.data.length > 0) {
            setLocalEntity(result.data[0])
        }
        setLoading(false)
    }

    function handleProviderClose() {
        setDisplayProvider(false)
        attachProvider()
    }

    return <Card css={{ position: 'relative', overflow: 'hidden', opacity: localEntity.provider === null ? 1 : 0.5 }} shadow="normal" padding="large">
        <div>{localEntity.label}</div>
        <Box css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><LinkExternal href={localEntity.link} target="_blank">{localEntity.link}</LinkExternal></Box>
        <Separator />
        <Grid fluid={true}>
            {localEntity.provider === null ? <ButtonLoading onClick={attachProvider} loading={loading} radius="pill">Je le prend !</ButtonLoading> : <div>{localEntity.provider} s'en occupe</div>}
            {localEntity.provider !== null && localEntity.provider === UserService.getProvider(localEntity.list_id) && <ButtonLoading onClick={removeProvider} loading={loading} theme="secondary" radius="pill">Annuler</ButtonLoading>}
        </Grid>
        <ModalListProvider id={localEntity.list_id} open={displayProvider} onClose={handleProviderClose}/>
    </Card>
}
