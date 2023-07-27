import { AvailableNetworkShorts } from "src/types/web3";
import { BinanceIcon } from "../icons/binance";
import { EtheriumIcon } from "../icons/etherium";
import { MaticIcon } from "../icons/matic";

export default function NetworkIcon(props: {
  network: AvailableNetworkShorts;
  width: number;
  height: number;
}) {
  const { network, width, height } = props;
  switch (network) {
    case "eth": {
      return <EtheriumIcon width={width} height={height} />;
    }
    case "bsc": {
      return <BinanceIcon width={width} height={height} />;
    }
    case "matic": {
      return <MaticIcon width={width} height={height} />;
    }
  }
}
