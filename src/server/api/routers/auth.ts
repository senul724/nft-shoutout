import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { setCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ address: z.string(), signature: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { address, signature } = input;
      try {
        let payload = {};
        const user = await ctx.prisma.user.findUnique({
          where: {
            address,
          },
          select: {
            signature: true,
            user_name: true,
            collections: {
              select: {
                address: true,
                collection_name: true,
              },
            },
          },
        });

        if (!user) {
          // hashing the signature to maximize the security
          const signatureHash = await bcrypt.hash(signature, 10);
          await ctx.prisma.user.create({
            data: {
              address,
              signature: signatureHash,
            },
          });
          payload = { address, userName: undefined, collections: undefined };
        } else {
          if (!await bcrypt.compare(signature, user.signature)) {
            throw new TRPCError({ code: "CONFLICT" });
          }
          payload = { address, userName: user.user_name, collections: user.collections };
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "1d",
        });
        setCookie("_session2", token);
        console.log(token);
      } catch {
        throw new TRPCError({ code: "PRECONDITION_FAILED" });
      }
    }),
});
