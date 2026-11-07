import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db()

/** Roles supported by the app. A user can pick one of these at sign-up. */
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
      // Default role applied when a sign-up doesn't include a role
      defaultRole: DEFAULT_ROLE,
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        // The sign-up form sends its selected role in the request body.
        // `role` is not a client-writable field on the user model, so it is
        // copied (and validated) into the user record here.
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
