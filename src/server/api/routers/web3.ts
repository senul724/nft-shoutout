import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract } from "ethers";
import { z } from "zod";
import { getErrorMsg } from "~/data/error-list";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { AvailableNetworks, ZodAvailableNetworks } from "~/types/web3";
import * as pvtRPCs from "~/web3/rpcs/private-rpcs.json";

export const web3Router = createTRPCRouter({
  shoutOut: privateProcedure
    .input(z.object({ userAddress: z.string(), collectionAddress: z.string(), msg: z.string().max(181) }))
    .mutation(({ input, ctx }) => {
      const { userAddress, collectionAddress, msg } = input;
    }),
  addHolder: privateProcedure
    .input(z.object({ collectionAddress: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userAddress = ctx.session.address;
      const { collectionAddress } = input;

      // the execution is based on the depth of the queries
      // check if the collection is registered
      const collection = await ctx.prisma.collection.findUnique({
        where: {
          address: collectionAddress,
        },
        select: {
          networks: true,
        },
      });
      if (!collection) {
        return { success: false, msg: "collection not available or registered" };
      }

      // users availabilty is checked before without using an upsert operation because rpc call are far more
      // expensive than a single db read

      // adding the collection to the users holding if not added
      const alreadyIn = await ctx.prisma.userHolds.findUnique({
        where: {
          holder_address_collection_address: { holder_address: userAddress, collection_address: collectionAddress },
        },
        select: {
          holder_address: true,
        },
      });
      if (alreadyIn) {
        return { success: false, msg: "already registered as a holder" };
      }

      // checking if the user is a holder of the Contract
      const availableNetworks: AvailableNetworks[] = JSON.parse(collection.networks).chains;
      const provider = new JsonRpcProvider(pvtRPCs[availableNetworks[0] as AvailableNetworks]);
      const contract = new Contract(collectionAddress, [
        "function balanceOf(address _owner) external view returns (uint256)",
      ], provider);
      try {
        // @ts-expect-error Stupid undefined bug
        const balance = await contract.callStatic.balanceOf(userAddress);
        if (!balance) {
          return { success: false, msg: getErrorMsg("sww") };
        }
        if (balance < 1) {
          return { success: false, msg: "you are not a holder of this collection" };
        }
      } catch {
        return { success: false, msg: "trouble calling to the contract" };
      }

      // adding the collection to the users holding if not added
      await ctx.prisma.userHolds.upsert({
        where: {
          holder_address_collection_address: { holder_address: userAddress, collection_address: collectionAddress },
        },

        create: {
          collection_address: collectionAddress,
          holder_address: userAddress,
        },
        update: {},
      });
    }),

  addCollection: privateProcedure
    .input(z.object({ collectionAddress: z.string(), networks: z.array(ZodAvailableNetworks) }))
    .mutation(async ({ input, ctx }) => {
      // get user address from the session
      const { address: userAddress } = ctx.session;
      const { collectionAddress, networks } = input;

      // users availabilty is checked before without using an upsert operation because rpc call are far more
      // expensive than a single db read

      // check if the collection is registered
      const collection = await ctx.prisma.collection.findUnique({
        where: {
          address: collectionAddress,
        },
        select: {
          owner_address: true,
        },
      });
      if (!collection) {
        return { success: false, msg: "collection not available or registered" };
      }

      // add a method here to figure out if the caller is the owner of the contract

      // adding the collection to the users holding if not added
      await ctx.prisma.collection.create({
        data: {
          address: collectionAddress,
          owner_address: userAddress,
          networks: JSON.stringify({ chains: networks }),
        },
      });
    }),
});
