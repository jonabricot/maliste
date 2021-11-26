export type EntityList = {
    id?: string,
    label: string,
    items: EntityListItem[],
    personal: Boolean,
    providers: string[],
    share: string,
    user: string
}

export type EntityListItem = {
    id?: string,
    label: string,
    link: string,
    providers: string[],
    share: string,
    list_id: string
}