import { client } from "@/data/client"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import LayoutBase from "@/components/Layout/LayoutBase"
import ListViewShare from "@/components/Entity/List/View/ListViewShare"
import ShareService from "@/services/ShareService"
import { EntityList } from "@/types/app"
import UserService from "@/services/UserService"

export default function SharedListPage() {
    const [entity, setEntity] = useState<EntityList>()
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

    useEffect(() => {
        if (entity !== undefined && UserService.getUser() !== entity.user) {
            ShareService.saveSharedList(entity.id)
        }
    }, [entity])

    return <LayoutBase>
        {entity ? <ListViewShare entity={entity} /> : 'loading'}
    </LayoutBase>
}