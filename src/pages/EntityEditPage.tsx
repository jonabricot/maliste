import ListFormDefault from "@/components/Entity/List/Form/ListFormDefault"
import ListViewDefault from "@/components/Entity/List/View/ListViewDefault"
import ItemViewDefault from "@/components/Entity/Item/View/ItemViewDefault"
import { listDataMock } from "@/data"
import { client } from "@/data/client"
import { EntityListItem } from "@/types/app"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import Container from "@/components/Layout/Container"
import Card from "@/components/Ui/Card"
import UserService from "@/services/UserService"

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