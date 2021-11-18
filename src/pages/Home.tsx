import { EntityList } from "@/types/app"
import { useEffect, useState } from "react"
import Link from "@/components/Typography/Link"
import {client} from "@/data/client"
import UserService from "@/services/UserService"
import Title from "@/components/Typography/Title"
import Grid from "@/components/Layout/Grid"
import Cell from "@/components/Layout/Cell"
import Card from "@/components/Ui/Card"
import LayoutBase from "@/components/Layout/LayoutBase"

export default function Home() {
    const [list, setList] = useState<EntityList[]>([])

    useEffect(async () => {
        const { data, error } = await client
            .from('list')
            .select()
            .eq('user', UserService.getUser())
        if (data) {
            setList(data)
        }
    }, [])

    return <LayoutBase>
        <Title>Your lists</Title>
        <Grid>
            {list.map(item => <Cell size={2} key={item.id}>
                <Link to={`/entity/list/${item.id}`}>
                    <Card padding="large" shadow="normal">{item.label}</Card>
                </Link>
            </Cell>)}
        </Grid>
        <Link to={'/entity/list/create'}>Create new list</Link>
    </LayoutBase>
}