import {hc} from "hono/client"
import {ApiType} from "api/types"

export const client = hc<ApiType>(import.meta.env.VITE_API_URL, {
    init: { 
        credentials: "include", 
    },
})