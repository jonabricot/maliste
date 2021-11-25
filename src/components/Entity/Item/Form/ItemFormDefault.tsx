import Grid from "@/components/Layout/Grid";
import ButtonLoading from "@/components/Ui/ButtonLoading";
import Input from "@/components/Ui/Form/Input";
import { EntityManager } from "@/data/EntityManager";
import { EntityListItem } from "@/types/app";
import { useState } from "react";

type EntityItemProps = {
    entity: EntityListItem,
    onEnd: Function
}

export default function ItemFormDefault({ entity, onEnd }: EntityItemProps) {
    const [loading, setLoading] = useState(false)
    const [label, setLabel] = useState(entity.label)
    const [link, setLink] = useState(entity.link)

    async function handleSubmit(e) {
        setLoading(true)
        e.preventDefault()
        if (entity.id) {
            const { data, error } = await new EntityManager('item').update(entity.id, { label, link, list_id: entity.list_id })
        }
        else {
            const { data, error } = await new EntityManager('item').create({ label, link, list_id: entity.list_id, providers: [] })
        }
        onEnd()
        setLoading(false)
    }

    return <form onSubmit={handleSubmit}>
        <Grid css={{ gridTemplateColumns: '1fr' }}>
            <Input label="Label" onChange={e => setLabel(e.target.value)} defaultValue={label} />
            <Input label="Link" onChange={e => setLink(e.target.value)} defaultValue={link} />
            <ButtonLoading type="submit" loading={loading}>
                {entity.id ? 'Update item' : 'Create item'}
            </ButtonLoading>
        </Grid>
    </form>
}