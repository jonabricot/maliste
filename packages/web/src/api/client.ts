import {type ApiType} from 'api/types'
import {hc} from "hono/client"

export const client = hc<ApiType>(import.meta.env.VITE_API_URL)