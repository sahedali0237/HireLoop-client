import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db()

export const ROLES = ["seeker", "recruiter", "admin"] as const
export type Role = (typeof ROLES)[number]
export const DEFAULT_ROLE: Role = "seeker"

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value)
}

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: DEFAULT_ROLE,
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const requested = (ctx?.body as Record<string, unknown> | undefined)?.role
          const role = isRole(requested) ? requested : DEFAULT_ROLE
          return {
            data: {
              ...user,
              role,
            },
          }
        },
      },
    },
  },
})
