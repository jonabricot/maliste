import ListFormDefault from "@/components/Entity/List/Form/ListFormDefault"
import { client } from "@/data/client"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import UserService from "@/services/UserService"
import LayoutBase from "@/components/Layout/LayoutBase"

export default function EntityEditPage() {
    const [entity, setEntity] = useState(null)
    let params = useParams()
    let entityType = params.type 
    let entityId = params.id
    let component: any

    if (entityType === 'list') {
        component = ListFormDefault
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