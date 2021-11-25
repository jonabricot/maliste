import { EntityManager } from "./EntityManager";

class EntityManagerList extends EntityManager {
    constructor() {
        super('list')
    }

    async loadItems(id: string) {
        return await this.client
            .from('item')
            .select()
            .eq('list_id', id)
            .order('created_at')
    }
}

export {EntityManagerList}