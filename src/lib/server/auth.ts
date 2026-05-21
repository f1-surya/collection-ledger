import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { organization } from "better-auth/plugins";
import { env } from "$env/dynamic/private";
import { getRequestEvent } from "$app/server";
import { db } from "$lib/server/db";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  session: {
    cookieCache: {
      maxAge: 60 * 5,
    },
  },
  experimental: {
    joins: true,
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
    sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
  ],
});
