import { SupabaseClient } from "@supabase/supabase-js";
import { client } from "./client";

class EntityManager {
    entityType: string
    client: SupabaseClient

    constructor(entityType: string) {
        this.client = client
        this.entityType = entityType
    }

    public async find(id: string) {
        return await this.client
            .from(this.entityType)
            .select()
            .eq('id', id)
            .single()
    }

    async create(data: object) {
        return await this.client.from(this.entityType).insert([data])
    }

    async update(id: string, data: object) {
        return await this.client.from(this.entityType).update([data]).eq('id', id)
    }
}

export {EntityManager}