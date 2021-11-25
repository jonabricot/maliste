import ListFormDefault from "@/components/Entity/List/Form/ListFormDefault"
import { client } from "@/data/client"
import UserService from "@/services/UserService"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import LayoutBase from "@/components/Layout/LayoutBase"

export default function EntityCreatePage() {
    const [entity, setEntity] = useState(null)
    let params = useParams()
    let entityType = params.type 
    let component: any

    if (entityType === 'list') {
        component = ListFormDefault
    }

    useEffect(async () => {
        const { data, error } = await client
            .from(entityType)
            .insert([{'user': UserService.getUser()}])
            .single()
            
        if (data) {
            setEntity(data)
        }
    }, [])

    return <LayoutBase>
        {entity ? React.createElement(component, { entity }) : 'loading'}
    </LayoutBase>
}