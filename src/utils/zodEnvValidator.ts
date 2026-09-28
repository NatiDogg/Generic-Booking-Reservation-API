import {z} from 'zod'
import {config} from 'dotenv'
config()
export const envSchema = z.object({
    DATABASE_URL: z.string().min(6),
    JWT_ACCESS_TOKEN: z.string().min(4),
    JWT_REFRESH_TOKEN: z.string().min(4)
})

export const validate = (config: Record<string,unknown>)=>{
           return envSchema.parse(config)
}

export const env = envSchema.parse(process.env)
export type envConfig = z.infer<typeof envSchema>