import React, { useEffect } from 'react'
import { useState } from "react"
import { EntityListItem } from '@/types/app'
import Card from '@/components/Ui/Card'
import { client } from '@/data/client'
import ButtonLoading from '@/components/Ui/ButtonLoading'
import ModalListProvider from '@/components/Ui/ModalListProvider'
import LinkExternal from '@/components/Typography/LinkExternal'
import Separator from '@/components/Typography/Separator'
import Box from '@/components/Layout/Box'
import Ellipsis from '@/components/Typography/Ellipsis'
import { useProvider, useUser } from '@/hooks/currentUser'
import { EntityManager } from '@/data/EntityManager'
import { Transition } from '@/components/Ui/Transition'
import Flex from '@/components/Layout/Flex'

type EntityListProps = {
    entity: EntityListItem, 
    onProvider: Function,
    forceProvider: boolean
}


export default function ItemViewShare({ entity, onProvider, forceProvider = false }: EntityListProps) {
    const [loading, setLoading] = useState(false)
    const [displayProvider, setDisplayProvider] = useState(false)
    const [localEntity, setLocalEntity] = useState(entity)
    const [provider] = useProvider(localEntity.list_id)

    useEffect(() => {
        if (forceProvider) {
            attachProvider()
        }
    }, [forceProvider])

    useEffect(() => {
        const mySubscription = client
            .from(`item:id=eq.${localEntity.id}`)
            .on('UPDATE', payload => {
                setLocalEntity(payload.new)
            })
            .subscribe()

        return () => {
            client.removeSubscription(mySubscription)
        }
    }, [localEntity])

    async function attachProvider() {
        if (!provider) {
            onProvider()
            return
        }

        setLoading(true)
        let result = await new EntityManager('item').update(localEntity.id, { providers: [...localEntity.providers, provider] })
        if (result.data) {
            setLocalEntity(result.data[0])
        }
        setLoading(false)
    }

    async function removeProvider() {
        setLoading(true)
        let providerIndex = localEntity.providers.indexOf(provider)
        let newProviders = [...localEntity.providers]
        if (providerIndex !== -1) {
            newProviders.splice(providerIndex, 1)
        }
        let result = await new EntityManager('item').update(localEntity.id, { providers: newProviders })

        if (result.data) {
            setLocalEntity(result.data[0])
        }
        setLoading(false)
    }

    function handleProviderClose() {
        setDisplayProvider(false)
        attachProvider()
    }

    const hasProvider = localEntity.providers.length > 0
    const hasCurrentProvider = localEntity.providers.includes(provider)

    return <Card css={{ position: 'relative', overflow: 'hidden' }} theme={localEntity.providers.length === 0 ? 'normal' : 'active'} shadow="normal" padding="large">
        <div>{localEntity.label}</div>
        <Ellipsis><LinkExternal href={localEntity.link} target="_blank">{localEntity.link}</LinkExternal></Ellipsis>
        <Separator/>
        <Flex css={{ flexDirection: 'column', alignItems: 'center', gap: '$normal' }}>
            {localEntity.providers.length > 0 && <div>{localEntity.providers.join(', ')} {localEntity.providers.length === 1 ? "s'en occupe" : "s'en occupent"}</div>}
            <Box css={{ position: 'relative', whiteSpace: 'nowrap' }}>
                <Transition animate={!hasProvider}>
                    <ButtonLoading onClick={attachProvider} loading={loading} radius="pill">Je le prend !</ButtonLoading>
                </Transition>
                <Box css={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
                    <Transition animate={hasCurrentProvider}>
                        <ButtonLoading onClick={removeProvider} loading={loading} theme="danger" radius="pill">Annuler</ButtonLoading>
                    </Transition>
                </Box>
                <Box css={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
                    <Transition animate={hasProvider && !hasCurrentProvider} css={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
                        <ButtonLoading onClick={attachProvider} theme="secondary" loading={loading} radius="pill">Je participe !</ButtonLoading>
                    </Transition>
                </Box>
            </Box>
        </Flex>
        <ModalListProvider id={localEntity.list_id} open={displayProvider} onClose={handleProviderClose}/>
    </Card>
}
