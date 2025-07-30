import { z } from 'zod'

export const envSchema = z.object({
  DB_URL: z.string().url(),
  APP_PORT: z.coerce.number().optional().default(3334),
  ORDER_SERVICE_URL: z
    .string()
    .url()
    .optional()
    .default('http://localhost:3333'),
  PRODUCTION_SERVICE_URL: z
    .string()
    .url()
    .optional()
    .default('http://localhost:3335')
})

export type Env = z.infer<typeof envSchema>
