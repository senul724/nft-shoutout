import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { getErrorMsg } from "~/data/error-list";
import { api } from "~/utils/api";
import { isValidAddress } from "~/web3/utils/address-validator";
import Compose from "./compose";

export interface ICollection {
  address: string;
  collection_name: string | null;
}

export default function Inbox(
  props: { collections: ICollection[] | null },
) {
  const { collections } = props;

  const [composing, setComposing] = useState(false);
  const [recepient, setRecepient] = useState<ICollection | null>(null);

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
    <>
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
                : <Card content="No collections to receive messages" />}
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
        )}
    </>
  );
}

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
