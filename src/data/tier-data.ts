import { AvailableTiers } from "src/types/web3";

export interface ISzeetaNFTData {
  nftName: string;
  cid: string;
  description: string;
  checkPoint: number;
  milestoneId: number;
}

export const tierLevels = [100, 500, 1000, 5000, 10000];

export default function getTierData(tier: AvailableTiers) {
  const tierData = {
    TIER1: {
      nftName: "Blue Badge",
      cid: "QmNRcLFRVjjT5ZpVQw9YqUfaYyMeJgcSaXigWgbgnAdgvt/1.json",
      description: "for contributing over 100$ in total through Szeeta",
      checkPoint: 100,
      milestoneId: 1,
    },
    TIER2: {
      nftName: "Bronze Badge",
      cid: "QmNRcLFRVjjT5ZpVQw9YqUfaYyMeJgcSaXigWgbgnAdgvt/2.json",
      description: "for contributing over 500$ in total through Szeeta",
      checkPoint: 500,
      milestoneId: 2,
    },
    TIER3: {
      nftName: "Silver Badge",
      cid: "QmNRcLFRVjjT5ZpVQw9YqUfaYyMeJgcSaXigWgbgnAdgvt/3.json",
      description: "for contributing over 1000$ in total through Szeeta",
      checkPoint: 1000,
      milestoneId: 3,
    },
    TIER4: {
      nftName: "Gold Badge",
      cid: "QmNRcLFRVjjT5ZpVQw9YqUfaYyMeJgcSaXigWgbgnAdgvt/4.json",
      description: "for contributing over 5000$ in total through Szeeta",
      checkPoint: 5000,
      milestoneId: 4,
    },
    TIER5: {
      nftName: "Diamond Badge",
      cid: "QmNRcLFRVjjT5ZpVQw9YqUfaYyMeJgcSaXigWgbgnAdgvt/5.json",
      description: "for contributing over 10000$ in total through Szeeta",
      checkPoint: 10000,
      milestoneId: 5,
    },
  };

  return tierData[tier];
}
