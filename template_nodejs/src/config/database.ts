import { knex } from 'knex'
import dotenv  from 'dotenv'

dotenv.config()

export const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 3306,
        database: 'gestion_citas',
        user: 'postgres',
        password: '1234',
    },
})

export default db