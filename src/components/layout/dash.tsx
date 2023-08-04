import Head from "next/head";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { BsBroadcast, BsDatabaseAdd, BsInboxesFill, BsPower } from "react-icons/bs";
import { useSession } from "~/hooks/use-session";
import { api } from "~/utils/api";
import { classNames } from "~/utils/utils";

export const Dash: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  const { mutateAsync: logout } = api.auth.logout.useMutation();
  const { session } = useSession();

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
            <p className="text-3xl font-bold text-white">Welcome again {session?.session.userName}!</p>
            <p className="-ml-10 w-full text-sm font-semibold text-center text-white">{session?.session.address}</p>
          </div>
          <button
            className={classNames(
              "hover:scale-105 gap-4 flex items-center justify-left text-2xl  font-bold text-white",
            )}
            onClick={() => void router.push("/dashboard")}
          >
            <BsInboxesFill size={25} /> inbox
          </button>
          <button
            className={classNames(
              "hover:scale-105  gap-4 flex items-center justify-left text-2xl  font-bold text-white",
            )}
            onClick={() => void router.push("/dashboard/new")}
          >
            <BsDatabaseAdd size={25} /> register collection
          </button>
          <button
            className={classNames(
              "hover:scale-105  gap-4 flex items-center justify-left text-2xl  font-bold text-white",
            )}
            onClick={() => void router.push("/dashboard/broadcast")}
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
        <div className="w-4/5 min-h-screen">
          {children}
        </div>
      </main>
    </>
  );
};
