import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "@/db/drizzle";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  session: {
    cookieCache: {
      maxAge: 60 * 5,
    },
  },
  plugins: [
    organization({
      schema: {
        organization: {
          additionalFields: {
            phoneNumber: {
              type: "string",
              input: true,
              required: true,
            },
            address: {
              type: "string",
              input: true,
              required: true,
            },
          },
        },
      },
    }),
  ],
});
