import ListViewDefault from "@/components/Entity/List/View/ListViewDefault"
import ItemViewDefault from "@/components/Entity/Item/View/ItemViewDefault"
import { client } from "@/data/client"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import LayoutBase from "@/components/Layout/LayoutBase"
import UserService from "@/services/UserService"

export default function EntityPage() {
    const [entity, setEntity] = useState(null)
    let params = useParams()
    let entityType = params.type 
    let entityId = params.id
    let component: any
    if (entityType === 'list') {
        component = ListViewDefault
    }
    if (entityType === 'item') {
        component = ItemViewDefault
    }

    useEffect(async () => {
        const { data, error } = await client
            .from(entityType)
            .select()
            .eq('id', entityId)
            .single()
            
        if (data) {
            setEntity(data)
        }
    }, [])

    return <LayoutBase>
        {entity && entity.user === UserService.getUser() && React.createElement(component, { entity })}
        {entity && entity.user !== UserService.getUser() && 'not found'}
    </LayoutBase>
}