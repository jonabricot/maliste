import { useEffect } from 'react'
import { useState } from "react"
import { EntityList } from '@/types/app'
import UserService from '@/services/UserService'
import Container from '@/components/Layout/Container'
import Box from '@/components/Layout/Box'
import Title from '@/components/Typography/Title'
import Grid from '@/components/Layout/Grid'
import Cell from '@/components/Layout/Cell'
import ButtonLoading from '@/components/Ui/ButtonLoading'
import { v4 } from 'uuid'
import Modal from '@/components/Ui/Modal'
import ItemViewDefault from '@/components/Entity/Item/View/ItemViewDefault'
import { EntityManagerList } from '@/data/EntityManagerList'
import Card from '@/components/Ui/Card'
import LinkInternal from '@/components/Typography/LinkInternal'

type EntityListProps = {
  entity: EntityList
}

export default function ListViewDefault({ entity }: EntityListProps) {
  const [localEntity, setLocalEntity] = useState(entity)
  const [shareLoading, setShareLoading] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [items, setItems] = useState([])

  useEffect(async () => {
    const { data, error } = await new EntityManagerList().loadItems(localEntity.id)
    if (data) {
      setItems(data)
    }
  }, [])

  useEffect(async () => {
    if (localEntity.share === null && showShare === true) {
      setShowShare(false)
      setShareLoading(true)
      const {data, error} = await new EntityManagerList().update(localEntity.id, { share: v4() })
      if (data) {
        setLocalEntity(data)
      }
      setShareLoading(false)
      setShowShare(true)
    }
  }, [localEntity, showShare])

  async function handleShare() {
    setShowShare(true)
  }

  return (
    <Container>
      <Grid fluid css={{ alignItems: 'center' }}>
        <Box css={{ display: 'flex', flex: 1, gap: '$normal', alignItems: 'center' }}>
          <Title >{localEntity.label}</Title>
          {localEntity.user === UserService.getUser() && <LinkInternal to={`/entity/list/${localEntity.id}/edit`}>Edit</LinkInternal>}
        </Box>
        <div>
          {localEntity.user === UserService.getUser() && <ButtonLoading onClick={handleShare} loading={shareLoading}>Partager ma liste</ButtonLoading>}
        </div>
      </Grid>
      <Grid>
        {items.map(item => <Cell size={2} key={item.id}>
          <ItemViewDefault
            entity={item}
          />
        </Cell>)}
      </Grid>

      <Modal open={showShare} onClose={() => setShowShare(false)}>
        <Grid>
          <Cell>Partage ce lien à qui tu veux !</Cell>
          <Cell>
            <Card theme="active">{`${window.location.protocol}//${window.location.host}/share/${localEntity.share}`}</Card>
          </Cell>
        </Grid>
      </Modal>
    </Container>
  )
}
