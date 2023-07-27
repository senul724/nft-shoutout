import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>NFT Shoutout</title>
        <meta name="description" content="Shoutout to your NFT community in a giffy!" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="flex flex-col justify-center items-center min-h-screen">
        <div className="container flex flex-col gap-12 justify-center items-center py-16 px-4">
          <div className="flex gap-4 text-8xl font-extrabold tracking-tight text-white drop-shadow-xl">
            <div className="p-5 bg-emerald-500 rounded-xl shadow-lg -skew-y-12">NFT</div><div className="text-emerald-500">Shoutout</div>
          </div>
          <p className="mt-10 text-2xl font-medium text-gray-600 drop-shadow"> Send a private shoutout to your NFT holders in just a click!</p>
        </div>
      </main>
    </>
  );
}
