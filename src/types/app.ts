export type EntityList = {
    id?: string,
    label: string,
    items: EntityListItem[]
}

export type EntityListItem = {
    id?: string,
    label: string,
    link: string,
    provider: string,
    share: string,
    list_id: string
}