import { Form, Formik } from "formik";
import type { ReactElement } from "react";
import { toast } from "react-hot-toast";
import CustomSelectComponent from "~/components/forms/custom-select-component";
import { CustomField } from "~/components/forms/field-component";
import { BinanceIcon } from "~/components/icons/binance";
import { EthereumIcon } from "~/components/icons/ethereum";
import { MaticIcon } from "~/components/icons/matic";
import { Dash } from "~/components/layout/dash";
import * as chainData from "~/data/chaindata-by-shorts.json";
import { getErrorMsg } from "~/data/error-list";
import type { NextPageWithLayout } from "~/pages/_app";
import type { AvailableNetworks, AvailableNetworkShorts } from "~/types/web3";
import { api } from "~/utils/api";
import { isValidAddress } from "~/web3/utils/address-validator";

const NewCollection: NextPageWithLayout = () => {
  const { mutateAsync: addCollection, isLoading } = api.web3.addCollection.useMutation();

  interface IValues {
    address: string;
    networks: {
      matic: boolean;
      bsc: boolean;
      eth: boolean;
    };
  }
  const initialValues: IValues = {
    address: "",
    networks: {
      matic: false,
      bsc: false,
      eth: false,
    },
  };
  const handleOnSubmit = async (values: IValues) => {
    const { address, networks } = values;
    if (!networks.matic && !networks.eth && !networks.bsc) {
      toast.error("select atleast one network");
      return;
    }

    if (!isValidAddress(address)) {
      toast.error("invalid contract address");
      return;
    }

    const networkShortList = Object.keys(networks).filter((e) => {
      if (networks[e as AvailableNetworkShorts]) return e;
    });
    const networkList = networkShortList.map(element => {
      return chainData[element as AvailableNetworkShorts].id;
    });

    toast.loading("registering collection...", { id: "register_collection" });
    const res = await addCollection({ collectionAddress: address, networks: networkList as AvailableNetworks[] });
    if (!res) {
      toast.error(getErrorMsg("sww"), { id: "register_collection" });
      return;
    }
    return res.success
      ? toast.success(res.msg, { id: "register_collection" })
      : toast.error(res.msg, { id: "register_collection" });
  };
  return (
    <div className="flex flex-col justify-center pl-32 w-2/3 min-h-screen items-left">
      <p className="mb-10 text-5xl font-bold text-gray-600">Register new collection</p>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => await handleOnSubmit(values)}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <div className="rounded-xl">
              <CustomField
                label={"collection address"}
                placeholder="enter valid address"
                name="address"
                validation={(value) => {
                  return isValidAddress(value) ? undefined : "invalid address";
                }}
                className="p-2 text-lg bg-gray-50 rounded-lg border"
                error={errors.address}
                touched={touched.address}
              />
              <h5 className="mt-10 mb-3 text-base font-semibold text-gray-900 md:text-xl">
                Network(s) that the colection is on
              </h5>
              <ul className="my-4 space-y-3">
                <li>
                  <CustomSelectComponent
                    icon={<MaticIcon />}
                    name="networks.matic"
                    label="Matic"
                    type="checkbox"
                  />
                </li>
                <li>
                  <CustomSelectComponent
                    icon={<BinanceIcon />}
                    name="networks.bsc"
                    label="Binance smart chain"
                    type="checkbox"
                  />
                </li>
                <li>
                  <CustomSelectComponent
                    icon={<EthereumIcon />}
                    name="networks.eth"
                    label="Ethereum"
                    type="checkbox"
                  />
                </li>
              </ul>
              <button
                type="submit"
                className="py-1 px-3 mt-4 text-xl font-medium text-white bg-emerald-500 rounded-xl shadow-xl hover:scale-105"
                disabled={isSubmitting || isLoading}
              >
                <h3>Add Collection</h3>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

NewCollection.getLayout = function getLayout(page: ReactElement) {
  return (
    <Dash>
      {page}
    </Dash>
  );
};
export default NewCollection;
