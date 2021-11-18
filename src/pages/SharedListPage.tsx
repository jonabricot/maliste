import ListViewDefault from "@/components/Entity/List/View/ListViewDefault"
import ItemViewDefault from "@/components/Entity/Item/View/ItemViewDefault"
import { client } from "@/data/client"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import LayoutBase from "@/components/Layout/LayoutBase"

export default function SharedListPage() {
    const [entity, setEntity] = useState(null)
    const { shareId } = useParams()

    useEffect(async () => {
        const { data, error } = await client
            .from('list')
            .select()
            .eq('share', shareId)
            .single()
            
        if (data) {
            setEntity(data)
        }
    }, [])

    return <LayoutBase>
        {entity ? <ListViewDefault entity={entity} /> : 'loading'}
    </LayoutBase>
}