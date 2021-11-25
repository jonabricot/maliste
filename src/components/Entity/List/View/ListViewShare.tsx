import { useEffect } from 'react'
import { useState } from "react"
import { EntityList } from '@/types/app'
import UserService from '@/services/UserService'
import Container from '@/components/Layout/Container'
import Title from '@/components/Typography/Title'
import Grid from '@/components/Layout/Grid'
import Cell from '@/components/Layout/Cell'
import Button from '@/components/Ui/Button'
import Link from '@/components/Typography/Link'
import ModalListProvider from '@/components/Ui/ModalListProvider'
import Paragraph from '@/components/Typography/Paragraph'
import ItemViewShare from '@/components/Entity/Item/View/ItemViewShare'
import { EntityManagerList } from '@/data/EntityManagerList'

type EntityListProps = {
  entity: EntityList
}

export default function ListViewShare({ entity }: EntityListProps) {
  const [localEntity, setLocalEntity] = useState(entity)
  const [showProviders, setShowProviders] = useState(false)
  const [forceProvider, setForceProvider] = useState(null)
  const [items, setItems] = useState([])

  useEffect(async () => {
    const { data, error } = await new EntityManagerList().loadItems(localEntity.id)
    if (data) {
      setItems(data)
    }
  }, [])

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

  if (localEntity.personal && localEntity.user === UserService.getUser()) {
    return <Container>
      <Paragraph>
        Non mais ca va pas oh ! Tu crois qu'on va te montrer tous tes cadeaux ou quoi ? Bah non
      </Paragraph>
      <Link to={'/'}>Retourne à l'accueil, coquin !</Link>
    </Container>
  }

  return <Container>
    <Grid fluid css={{ alignItems: 'center' }}>
      <Title css={{ flex: 1 }}>{localEntity.label}</Title>
    </Grid>
    {UserService.hasProvider(localEntity.id) && <Paragraph>Salut {UserService.getProvider(localEntity.id)}. </Paragraph>}
    <Grid>
      {items.map(item => <Cell size={2} key={item.id}>
        <ItemViewShare
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
  </Container>
}
