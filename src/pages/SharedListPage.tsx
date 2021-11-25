import { client } from "@/data/client"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import LayoutBase from "@/components/Layout/LayoutBase"
import ListViewShare from "@/components/Entity/List/View/ListViewShare"

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
        {entity ? <ListViewShare entity={entity} /> : 'loading'}
    </LayoutBase>
}