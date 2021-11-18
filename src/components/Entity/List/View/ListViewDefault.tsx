import React, { useEffect } from 'react'
import { useState } from "react"
import { EntityList, EntityListItem } from '@/types/app'
import { client } from '@/data/client'
import ItemViewDefault from '@/components/Entity/Item/View/ItemViewDefault'
import UserService from '@/services/UserService'
import Container from '@/components/Layout/Container'
import Box from '@/components/Layout/Box'
import Title from '@/components/Typography/Title'
import Grid from '@/components/Layout/Grid'
import Cell from '@/components/Layout/Cell'
import Button from '@/components/Ui/Button'
import Link from '@/components/Typography/Link'
import ModalListProvider from '@/components/Ui/ModalListProvider'
import Paragraph from '@/components/Typography/Paragraph'
import ButtonLoading from '@/components/Ui/ButtonLoading'
import { v4 } from 'uuid'
import Modal from '@/components/Ui/Modal'
import Input from '@/components/Ui/Form/Input'

type EntityListProps = {
  entity: EntityList
}

export default function ListViewDefault({ entity }: EntityListProps) {
  const [localEntity, setLocalEntity] = useState(entity)
  const [shareLoading, setShareLoading] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showProviders, setShowProviders] = useState(false)
  const [forceProvider, setForceProvider] = useState(null)
  const [items, setItems] = useState([])

  useEffect(async () => {
    const { data, error } = await client
      .from('item')
      .select()
      .eq('list_id', localEntity.id)
    if (data) {
      setItems(data)
    }
  }, [])

  async function reloadEntity() {
    const { data, error } = await client
      .from('list')
      .select()
      .eq('id', localEntity.id)
      .single()
    if (data) {
      setLocalEntity(data)
    }
  }

  function handleItemProvider(id) {
    setShowProviders(true)
    setForceProvider(id)
  }

  function handleCloseProvider(id) {
    setShowProviders(false)
    setTimeout(() => {
      setForceProvider(null)
    }, 100)
  }

  async function handleShare() {
    if (localEntity.share !== null) {
      setShowShare(true)
    }
    else {
      setShareLoading(true)
      await client.from('list').update([{ share: v4() }]).eq('id', localEntity.id)
      await reloadEntity()
      handleShare()
      setShareLoading(false)
    }
  }

  return (
    <Container>
      <Grid fluid css={{ alignItems: 'center' }}>
        <Title css={{ flex: 1 }}>{localEntity.label}</Title>
        <div>
          {localEntity.user === UserService.getUser() && <ButtonLoading onClick={handleShare} loading={shareLoading}>Partager ma liste</ButtonLoading>}
        </div>
      </Grid>
      {UserService.hasProvider(localEntity.id) && <Paragraph>Salut {UserService.getProvider(localEntity.id)}. </Paragraph>}
      <Grid>
        {items.map(item => <Cell size={2} key={item.id}>
          <ItemViewDefault 
            entity={item} 
            onProvider={() => handleItemProvider(item.id)} 
            forceProvider={showProviders === false && forceProvider === item.id} 
          />
        </Cell>)}
        <Cell>
          <Button theme="link" padding="none" onClick={() => setShowProviders(true)}>
            {
              UserService.hasProvider(localEntity.id) ?
                <span>Je ne suis pas {UserService.getProvider(localEntity.id)}...</span> :
                <span>Qui est-tu ?</span>
            }
          </Button>
        </Cell>
      </Grid>
      <ModalListProvider id={localEntity.id} open={showProviders} onClose={handleCloseProvider} />
      <Modal open={showShare} onClose={() => setShowShare(false)}>
        <Grid>
          <Cell>
            <Input disabled label="Partage ce lien à qui tu veux !" defaultValue={`${window.location.protocol}//${window.location.host}/share/${localEntity.share}`} />
            </Cell>
        </Grid>
      </Modal>
    </Container>
  )
}
