import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { withPulse } from '@prisma/extension-pulse'

export const prisma = new PrismaClient().$extends(withAccelerate()).$extends(
    withPulse({ apiKey: process.env.PULSE_API_KEY })
)