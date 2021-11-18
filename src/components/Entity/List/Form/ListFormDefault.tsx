import React, { useEffect } from 'react'
import { useState } from "react"
import { EntityList, EntityListItem } from '@/types/app'
import ItemFormDefault from '@/components/Entity/Item/Form/ItemFormDefault'
import { client } from '@/data/client'
import Modal from '@/components/Ui/Modal'
import Button from '@/components/Ui/Button'
import { useNavigate } from "react-router-dom";
import Card from '@/components/Ui/Card'
import Input from '@/components/Ui/Form/Input'
import Title from '@/components/Typography/Title'
import Grid from '@/components/Layout/Grid'
import Cell from '@/components/Layout/Cell'
import Box from '@/components/Layout/Box'

type EntityListProps = {
  entity: EntityList
}

export default function ListFormDefault({ entity }: EntityListProps) {
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState(entity.label)
  const [items, setItems] = useState([])
  const [editItem, setEditItem] = useState(null)
  const [newItem, showNewItem] = useState(false)
  const [providers, setProviders] = useState(entity.providers ?? [])
  const navigate = useNavigate()

  useEffect(async () => {
    await loadItems()
  }, [])
  
  async function handleSubmit(e) {
    e.preventDefault()
    const { data, error } = await client
      .from('list')
      .update({ label, providers })
      .eq('id', entity.id)
    
    navigate(`/entity/list/${entity.id}`)
  }

  async function loadItems() {
    setLoading(true)
    const { data, error } = await client
      .from('item')
      .select()
      .eq('list_id', entity.id)
      .order('created_at')

    if(data) {
      setItems(data)
    }
    setLoading(false)
    setEditItem(null)
    showNewItem(false)
  }

  function setProvider(index, value) {
    let tmpProviders = [...providers]
    tmpProviders[index] = value
    setProviders(tmpProviders)
  }

  function removeProvider(index) {
    let tmpProviders = [...providers]
    tmpProviders.splice(index, 1)
    setProviders(tmpProviders)
  }

  return <Card>
    <form onSubmit={handleSubmit}>
      <Grid css={{ gridTemplateColumns: '1fr' }}>
      <Title>List edition</Title>

      <Input label="Name" onInput={e => setLabel(e.target.value)} defaultValue={label}/>

      <Grid>
        {items.map(item => <Cell size={2} key={item.id}>
          <Card theme="active">
            <Grid fluid css={{ alignItems: 'center' }}>
              <Box css={{ flex: 1 }}>
                {item.label}
              </Box>
              <Button type="button" theme="link" onClick={() => setEditItem(item.id)}>edit</Button>
            </Grid>
          </Card>
          
          <Modal open={editItem === item.id} onClose={() => setEditItem(null)}><ItemFormDefault entity={item} onEnd={loadItems} /></Modal>
        </Cell> )}
        <Cell size={2}>
          <Card theme="active">
            <Button theme="link" type='button' onClick={() => showNewItem(true)} css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>Add item</Button>
          </Card>
        </Cell>
      </Grid>
      <div>  providers: </div>
      <Grid>
        {providers.map((provider, index) => <Cell size={2} key={`${index}`}>
          <Card theme="active">
            <Grid fluid css={{ alignItems: 'center' }}>
              <Box css={{ flex: 1 }}>
                <Input label={`Provider ${index + 1}`} onInput={e => setProvider(index, e.target.value)} defaultValue={provider} />
              </Box>
              <Button theme="danger" onClick={() => removeProvider(index)} type='button'>remove</Button>
            </Grid>
          </Card>
          
        </Cell>)}
        <Cell size={2}>
          <Card theme="active">
            <Button theme="link" type="button" onClick={() => setProviders([...providers, ''])} css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>Add provider</Button>
          </Card>
        </Cell>
      </Grid>
      <Button theme="success">Save data</Button>
      </Grid>
    </form>
    <Modal open={newItem} onClose={() => showNewItem(false)}><ItemFormDefault entity={{ label: '', link: '', list_id: entity.id }} onEnd={loadItems} /></Modal>
  </Card>
}
