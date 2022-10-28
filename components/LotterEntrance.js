import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotterEntrance() {
  const [entranceFee, setEntranceFee] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntraceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (await getEntraceFee()).toString();
    const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromContract = await getRecentWinner();

    setEntranceFee(entranceFeeFromCall);
    setNumberOfPlayers(numberOfPlayersFromCall);
    setRecentWinner(recentWinnerFromContract);
  }

  useEffect(() => {
    if (isWeb3Enabled) updateUI();
  }, [isWeb3Enabled]);

  // const filter = {
  //   recentWinner,
  //   topics: [
  //     // the name of the event, parnetheses containing the data type of each event, no spaces
  //     utils.id("WinnerPicked(recentWinner)"),
  //   ],
  // };

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNotification();
    updateUI();
  };

  const handleNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction complete!",
      title: "Transaction Notification",
      position: "topR",
    });
  };

  return (
    <div className="p-5">
      {raffleAddress ? (
        <div className="p-3">
          <button
            className="bg-blue-500 hover:bg-blue-700 transition-colors text-white cursor-pointer py-2 px-3 rounded mb-2"
            type="button"
            onClick={async () => {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.error(error),
              });
            }}
            disabled={isLoading || isFetching}
          >
            <div className="flex gap-3 items-center">
              {isLoading || isFetching ? (
                <div className="animate-spin spinner-border h-5 w-5 border-b-2 rounded-full"></div>
              ) : null}
              Enter Raffle
            </div>
          </button>
          <div className="flex flex-col gap-1">
            <div>
              Hi, from lottery Entrance. Entrance fee is{" "}
              <span className="text-gray-400">
                {ethers.utils.formatUnits(entranceFee, "ether")} ETH
              </span>
            </div>
            <div>
              <strong>Total number of players:</strong>{" "}
              <span className="text-gray-400">{numberOfPlayers}</span>
            </div>
            <div>
              <strong>Recent winner:</strong>{" "}
              <span className="text-gray-400">{recentWinner}</span>
            </div>
          </div>
        </div>
      ) : (
        <>No Raffle address detected</>
      )}
    </div>
  );
}
