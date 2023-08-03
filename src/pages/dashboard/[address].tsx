import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsBroadcast, BsDatabaseAdd, BsInboxesFill, BsPower } from "react-icons/bs";
import Broadcast from "~/components/dashboard/broadcast";
import Inbox, { type ICollection } from "~/components/dashboard/inbox";
import New from "~/components/dashboard/new";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { classNames } from "~/utils/utils";

interface IPayload {
  address: string;
  userName: string | null;
  holdings: ICollection[] | null;
  collections: ICollection[] | null;
}

export default function UserDash(
  props: IPayload,
) {
  const { holdings, collections, address, userName } = props;
  const router = useRouter();

  const { mutateAsync: logout } = api.auth.logout.useMutation();

  const [tab, setTab] = useState<"inbox" | "new" | "msg">("inbox");

  const handleLogout = async () => {
    await logout();
    await router.push("/");
  };

  return (
    <>
      <Head>
        <title>dashboard</title>
        <meta name="description" content="Shoutout to your NFT community in a giffy!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div className="flex flex-col gap-12 justify-center py-5 pl-20 w-1/5 min-h-screen bg-emerald-600 shadow-2xl items-left">
          <div className="flex flex-col gap-4 w-full">
            <p className="text-3xl font-bold text-white">Welcome again {userName}!</p>
            <p className="-ml-10 w-full text-sm font-semibold text-center text-white">{address}</p>
          </div>
          <button
            className={classNames(
              "hover:scale-105 gap-4 flex items-center justify-left text-2xl  font-bold text-white",
            )}
            onClick={() => setTab("inbox")}
          >
            <BsInboxesFill size={25} /> inbox
          </button>
          <button
            className={classNames(
              "hover:scale-105  gap-4 flex items-center justify-left text-2xl  font-bold text-white",
            )}
            onClick={() => setTab("new")}
          >
            <BsDatabaseAdd size={25} /> register collection
          </button>
          <button
            className={classNames(
              "hover:scale-105  gap-4 flex items-center justify-left text-2xl  font-bold text-white",
            )}
            onClick={() => setTab("msg")}
          >
            <BsBroadcast size={25} /> broadcast
          </button>
          <button
            className={classNames(
              "hover:scale-105  gap-4 flex items-center justify-left text-2xl  font-bold text-white",
            )}
            onClick={() => void handleLogout()}
          >
            <BsPower size={25} /> logout
          </button>
        </div>
        <div className="py-5 w-4/5 min-h-screen">
          {tab === "inbox"
            && <Inbox collections={holdings} />}
          {tab === "msg"
            && <Broadcast collections={collections} callback={() => setTab("new")} />}
          {tab === "new" && <New />}
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const users = await prisma.user.findMany({
    select: {
      address: true,
    },
  });

  const paths = users.map((user) => ({
    params: { address: user.address },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps(props: { params: { address: string } }) {
  const { params } = props;
  const userData = await prisma.user.findUnique({
    where: {
      address: params.address,
    },
    select: {
      user_name: true,
      collections: {
        select: {
          address: true,
          collection_name: true,
        },
      },
      holdings: {
        select: {
          collection: {
            select: {
              address: true,
              collection_name: true,
            },
          },
        },
      },
    },
  });

  let payload: IPayload = { address: params.address, collections: null, holdings: null, userName: null };
  if (userData) {
    const holdings = userData.holdings.map((el) => el.collection);
    payload = { address: params.address, collections: userData.collections, holdings, userName: userData.user_name };
  }

  return {
    props: payload,
    revalidate: 60,
  };
}
