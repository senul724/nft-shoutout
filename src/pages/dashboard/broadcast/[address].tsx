import { useRouter } from "next/router";
import { type ReactElement, useState } from "react";
import Compose from "~/components/dashboard/compose";
import { Dash } from "~/components/layout/dash";
import type { NextPageWithLayout } from "~/pages/_app";
import { prisma } from "~/server/db";

interface ICollection {
  address: string;
  collection_name: string | null;
}

interface IPayload {
  collections: ICollection[] | null;
}

const Broadcast: NextPageWithLayout<IPayload> = (props) => {
  const { collections } = props;

  const router = useRouter();

  const [composing, setComposing] = useState(false);
  const [recepient, setRecepient] = useState<ICollection | null>(null);

  return (
    <div className="py-5 w-full min-h-screen">
      {composing
        ? (
          <Compose
            name={recepient?.collection_name}
            address={recepient?.address}
            closeAction={() => setComposing(false)}
          />
        )
        : (
          <div className="flex flex-col justify-center items-center w-full min-h-screen">
            <div className="grid grid-cols-2 gap-4 px-10 w-full">
              {collections && collections.length > 0
                ? (
                  <>
                    {collections.map((el, i) => (
                      <Card
                        content={el.collection_name ? el.collection_name : el.address}
                        key={i}
                        onClickHandler={() => {
                          setRecepient(el);
                          setComposing(true);
                        }}
                      />
                    ))}
                  </>
                )
                : <Card content="You have not registered any collection to boradcast" />}
            </div>
            <div
              className="p-4 mt-10 w-1/2 text-2xl font-bold text-center text-emerald-600 rounded-xl border border-emerald-600 shadow-lg hover:scale-105 bg-whte"
              onClick={() => void router.push("/dashboard/new")}
            >
              register your collection to boradcast
            </div>
          </div>
        )}
    </div>
  );
};

function Card(props: { content: string; onClickHandler?: () => void }) {
  const { content, onClickHandler } = props;
  return (
    <div
      className="py-5 text-2xl font-semibold text-center text-gray-600 bg-white rounded-xl border shadow-lg hover:scale-105"
      onClick={() => onClickHandler ? void onClickHandler() : null}
    >
      {content}
    </div>
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
      collections: {
        select: {
          address: true,
          collection_name: true,
        },
      },
    },
  });

  return {
    props: { collections: userData?.collections ?? null },
    revalidate: 60,
  };
}

Broadcast.getLayout = function getLayout(page: ReactElement) {
  return (
    <Dash>
      {page}
    </Dash>
  );
};
export default Broadcast;
