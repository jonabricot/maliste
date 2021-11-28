import { EntityListItem } from '@/types/app'
import Card from '@/components/Ui/Card'
import Box from '@/components/Layout/Box'
import Link from '@/components/Typography/Link'

type EntityListProps = {
    entity: EntityListItem, 
}


export default function ItemViewDefault({ entity }: EntityListProps) {
    return <Card css={{ position: 'relative', overflow: 'hidden' }} shadow="normal" padding="large">
        <div>{entity.label}</div>
        <Box css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <Link href={entity.link} target="_blank">{entity.link}</Link>
        </Box>
    </Card>
}
