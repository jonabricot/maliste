import { useEffect } from 'react'
import { useState } from "react"
import { EntityList } from '@/types/app'
import UserService from '@/services/UserService'
import Container from '@/components/Layout/Container'
import Box from '@/components/Layout/Box'
import Title from '@/components/Typography/Title'
import Grid from '@/components/Layout/Grid'
import Cell from '@/components/Layout/Cell'
import Link from '@/components/Typography/Link'
import ButtonLoading from '@/components/Ui/ButtonLoading'
import { v4 } from 'uuid'
import Modal from '@/components/Ui/Modal'
import Input from '@/components/Ui/Form/Input'
import ItemViewDefault from '@/components/Entity/Item/View/ItemViewDefault'
import { EntityManagerList } from '@/data/EntityManagerList'

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
    const { data, error } = await new EntityManagerList().loadItems(localEntity.id)
    if (data) {
      setItems(data)
    }
  }, [])

  async function reloadEntity() {
    const { data, error } = await new EntityManagerList().find(localEntity.id)
    if (data) {
      setLocalEntity(data)
    }
  }

  async function handleShare() {
    if (localEntity.share !== null) {
      setShowShare(true)
    }
    else {
      setShareLoading(true)
      await new EntityManagerList.update(localEntity.id, { share: v4() })
      await reloadEntity()
      handleShare()
      setShareLoading(false)
    }
  }

  return (
    <Container>
      <Grid fluid css={{ alignItems: 'center' }}>
        <Box css={{ display: 'flex', flex: 1, gap: '$normal', alignItems: 'center' }}>
          <Title >{localEntity.label}</Title>
          <Link to={`/entity/list/${localEntity.id}/edit`}>Edit</Link>
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
          <Cell>
            <Input disabled label="Partage ce lien à qui tu veux !" defaultValue={`${window.location.protocol}//${window.location.host}/share/${localEntity.share}`} />
            </Cell>
        </Grid>
      </Modal>
    </Container>
  )
}
