import { EntityList } from "@/types/app"
import { useEffect, useState } from "react"
import Link from "@/components/Typography/LinkInternal"
import {client} from "@/data/client"
import UserService from "@/services/UserService"
import Title from "@/components/Typography/Title"
import Grid from "@/components/Layout/Grid"
import Cell from "@/components/Layout/Cell"
import Card from "@/components/Ui/Card"
import LayoutBase from "@/components/Layout/LayoutBase"
import ShareService from "@/services/ShareService"
import Separator from "@/components/Typography/Separator"
import Paragraph from "@/components/Typography/Paragraph"
import LinkInternal from "@/components/Typography/LinkInternal"

export default function Home() {
    const [list, setList] = useState<EntityList[]>([])
    const [sharedList, setSharedList] = useState<EntityList[]>([])

    useEffect(async () => {
        const { data, error } = await client
            .from('list')
            .select()
            .eq('user', UserService.getUser())
        if (data) {
            setList(data)
        }
    }, [])

    useEffect(async () => {
        const { data, error } = await client
            .from('list')
            .select()
            .in('id', ShareService.getSharedList())
        if (data) {
            setSharedList(data)
        }
    }, [])

    return <LayoutBase>
        <Title>Vos listes</Title>
        <Grid>
            {list.map(item => <Cell size={2} key={item.id}>
                <LinkInternal to={`/entity/list/${item.id}`} css={{ display: 'block' }}>
                    <Card padding="large" shadow="normal">{item.label}</Card>
                </LinkInternal>
            </Cell>)}
            <Cell size={2}>
                <LinkInternal to={'/entity/list/create'} linkProps={{ padding: 'normal', theme: 'primary' }}>Créer une liste</LinkInternal>
            </Cell>
        </Grid>
        <Separator />
        <Title>Les listes qu'on vous a partagé</Title>
        {sharedList.length === 0 && <Paragraph muted>On ne vous a pas encore partagé de liste.</Paragraph>}
        <Grid>
            {sharedList.map(item => <Cell size={2} key={item.id}>
                <LinkInternal to={`/share/${item.share}`} css={{ display: 'block' }}>
                    <Card padding="large" shadow="normal">{item.label}</Card>
                </LinkInternal>
            </Cell>)}
        </Grid>
    </LayoutBase>
}