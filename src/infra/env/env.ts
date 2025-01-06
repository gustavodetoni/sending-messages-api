import 'dotenv/config'
import { z } from 'zod'

export const schemaEnv = z.object({
  API_KEY: z.string(),
  BASE_URL: z.string(),
})

const _env = schemaEnv.safeParse(process.env)

if (!_env.success) {
  console.error(_env.error.errors)
  process.exit(1)
}

export const env = _env.data
