import { useRouter } from "next/router";
import { ReactElement, useRef } from "react";
import { toast } from "react-hot-toast";
import { Dash } from "~/components/layout/dash";
import { getErrorMsg } from "~/data/error-list";
import { NextPageWithLayout } from "~/pages/_app";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { isValidAddress } from "~/web3/utils/address-validator";

interface ICollection {
  address: string;
  collection_name: string | null;
}

interface IPayload {
  holdings: ICollection[] | null;
}

const UserDash: NextPageWithLayout<IPayload> = (props) => {
  const { holdings } = props;

  const router = useRouter();

  const { mutateAsync: addHoldings, isLoading } = api.web3.addHolder.useMutation();

  const addressRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const collectionAddress = addressRef.current?.value;
    if (isLoading) {
      return;
    }

    if (!collectionAddress || !isValidAddress(collectionAddress)) {
      toast.error("invalid address", { id: "add_holdings" });
      return;
    }
    toast.loading("adding collection to holdings...", { id: "add_holdings" });
    const res = await addHoldings({ collectionAddress });
    if (!res) {
      toast.error(getErrorMsg("sww"), { id: "add_holdings" });
      return;
    }
    return res.success
      ? toast.success(res.msg, { id: "add_holdings" })
      : toast.error(res.msg, { id: "add_holdings" });
  };

  return (
    <div className="py-5 w-full min-h-screen">
      <div className="flex flex-col justify-center items-center w-full min-h-screen">
        <div className="grid grid-cols-2 gap-4 px-10 w-full">
          {holdings && holdings.length > 0
            ? (
              <>
                {holdings.map((el, i) => (
                  <Card
                    content={el.collection_name ? el.collection_name : el.address}
                    key={i}
                    onClickHandler={() => {
                      router.push(`/dashboard/collection/${el.address}`);
                    }}
                  />
                ))}
              </>
            )
            : <Card content="No holdings to receive messages" />}
        </div>
        <div className="flex flex-col p-5 mt-10 w-1/2 rounded-xl border">
          <label className="text-xl font-semibold text-gray-900">
            Prove your holdings holding to receive messages
          </label>
          <div className="flex gap-4 mt-10 w-full">
            <input
              className="p-2 w-2/3 text-lg rounded-lg"
              ref={addressRef}
              placeholder="Enter collection address"
            />
            <button
              className="p-2 w-1/3 text-xl font-bold text-white bg-blue-400 rounded-lg drop-shadow"
              onClick={() => void handleSubmit()}
            >
              add
            </button>
          </div>
        </div>
      </div>
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

  let payload: IPayload = { holdings: null };
  if (userData) {
    const holdings = userData.holdings.map((el) => el.collection);
    payload = { holdings };
  }

  return {
    props: payload,
    revalidate: 60,
  };
}

UserDash.getLayout = function getLayout(page: ReactElement) {
  return (
    <Dash>
      {page}
    </Dash>
  );
};
export default UserDash;
