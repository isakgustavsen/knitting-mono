import { createFileRoute } from "@tanstack/react-router";
import { protectedRequestMiddleware } from "@/core/middleware/auth";
import { Polar } from "@polar-sh/sdk";
import { env } from "cloudflare:workers";

export const Route = createFileRoute("/_auth/app/polar/portal")({
  server: {
    middleware: [protectedRequestMiddleware],
    handlers: {
      GET: async (ctx) => {
        const polar = new Polar({
          accessToken: env.POLAR_SECRET,
          server: "sandbox",
        });
        const customerSession = await polar.customerSessions.create({
          externalCustomerId: ctx.context.userId,
        });
        return new Response(null, {
          status: 302,
          headers: {
            Location: customerSession.customerPortalUrl,
          },
        });
      },
    },
  },
});
