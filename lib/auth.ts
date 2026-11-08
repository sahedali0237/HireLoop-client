import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import type { Role } from "@/lib/navigation"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db("HireLoopDB")

export const ROLES: readonly Role[] = ["seeker", "recruiter", "admin"]
export const DEFAULT_ROLE: Role = "seeker"

const SELF_ASSIGNABLE: Role[] = ["seeker", "recruiter"]

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: DEFAULT_ROLE,
        input: true, // client may send it
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requested = (user as { role?: Role }).role
          const role =
            requested && SELF_ASSIGNABLE.includes(requested)
              ? requested
              : DEFAULT_ROLE
          return { data: { ...user, role } }
        },
      },
    },
  },
})
