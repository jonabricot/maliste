import dotenv from 'dotenv'

export function processEnvFile() {
    dotenv.config({ path: ['.env.local', '.env'] })
}