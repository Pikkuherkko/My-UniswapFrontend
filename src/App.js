import { useState, useEffect } from "react";
import { ethers } from "ethers";
import PageButton from "./components/PageButton";
// import ConnectButton from "./components/ConnectButton";
import ConfigModal from "./components/ConfigModal";
import gear from "./components/gear2.png";
import BeatLoader from "react-spinners/BeatLoader";
import CurrencyField from "./components/CurrencyField";
import {
  getWethContract,
  getUniContract,
  getPrice,
  runSwap,
} from "./AlphaRouterService";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import { injected } from "./components/Connectors";

function getLibrary(provider) {
  return new Web3(provider);
}

export const AppBody = () => {
  const [signer, setSigner] = useState(undefined);
  const [walletConnected, setWalletConnected] = useState(false);

  const [slippageAmount, setSlippageAmount] = useState(2);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [showModal, setShowModal] = useState(false);

  const [inputAmount, setInputAmount] = useState(undefined);
  const [outputAmount, setOutputAmount] = useState(undefined);
  const [transaction, setTransaction] = useState(undefined);
  const [loading, setLoading] = useState(undefined);
  const [ratio, setRatio] = useState(undefined);
  const [wethContract, setWethContract] = useState(undefined);
  const [uniContract, setUniContract] = useState(undefined);
  const [wethAmount, setWethAmount] = useState(undefined);
  const [uniAmount, setUniAmount] = useState(undefined);

  const { active, account, activate, deactivate } = useWeb3React();

  const connect = async () => {
    try {
      await activate(injected);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);
      const wethContract = getWethContract();
      setWethContract(wethContract);
      const uniContract = getUniContract();
      setUniContract(uniContract);
      localStorage.setItem("isWalletConnected", true);
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const disconnect = async () => {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", false);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await connect();
          // getBalances();
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  const getBalances = async () => {
    try {
      wethContract.balanceOf(account).then((res) => {
        setWethAmount(Number(ethers.utils.formatEther(res)));
      });
      uniContract.balanceOf(account).then((res) => {
        setUniAmount(Number(ethers.utils.formatEther(res)));
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (signer !== undefined) {
    getBalances();
  }

  const getSwapPrice = (inputAmount) => {
    setLoading(true);
    setInputAmount(inputAmount);
    const swap = getPrice(
      inputAmount,
      slippageAmount,
      Math.floor(Date.now() / 1000 + deadlineMinutes * 60),
      account
    ).then((data) => {
      setTransaction(data[0]); // data returns an array and first element is the transaction
      setOutputAmount(data[1]); // second element is the amount of second token that comes out of the swap
      setRatio(data[2]); // price ratio of first and secod token
      setLoading(false);
    });
    console.log(swap);
  };

  return (
    <div className="bg-slate-200 bg-cover min-h-screen">
      <div name="NAVBAR" className="flex flex-row p-4 truncate">
        <div className="basis-2/5 font1 my-4 text-2xl font-bold ml-4">
          Uniswap Frontend
        </div>
        <div
          name="MIDDLE BUTTONS"
          className="flex flex-row basis-1/5 justify-center bg-white rounded-2xl my-4 p-2"
        >
          <PageButton name={"Swap"} isBold={true} />
          <PageButton name={"Pool"} />
          <PageButton name={"Vote"} />
          <PageButton name={"Charts"} />
        </div>
        <div className="basis-1/5"></div>
        <div
          name="RIGHT BUTTONS"
          className="flex flex-row basis-1/5 justify-center"
        >
          <div className="px-2 my-6">Görli testnet</div>
          <div
            name="connectButtonContainer"
            className="bg-orange-500 rounded-2xl px-2 my-2 text-white"
          >
            {active ? (
              <button
                onClick={disconnect}
                className="flex justify-center my-4 font-bold px-2"
              >
                {account?.substring(0, 6)}...
              </button>
            ) : (
              <button
                onClick={connect}
                className="flex justify-center my-4 font-bold px-2"
              >
                Connect
              </button>
            )}
          </div>
          <div className="my-2 bg-white rounded-2xl ml-4 flex items-center">
            <PageButton name={"..."} isBold={true} />
          </div>
        </div>
      </div>
      <div name="APPBODY" className="flex flex-row justify-center">
        <div
          name="SWAPCONTAINER"
          className="bg-white p-4 w-96 h-80 rounded-2xl mt-20"
        >
          <div name="SWAPHEADER" className="flex flex-row justify-between">
            <h2 name="SWAPTEXT">Swap</h2>
            <button name="GEARCONTAINER" onClick={() => setShowModal(true)}>
              <img src={gear} alt="gear.png" className="w-6" />
            </button>
            {showModal && (
              <ConfigModal
                onClose={() => setShowModal(false)}
                setDeadlineMinutes={setDeadlineMinutes}
                deadlineMinutes={deadlineMinutes}
                setSlippageAmount={setSlippageAmount}
                slippageAmount={slippageAmount}
              />
            )}
          </div>
          <div name="SWAPBODY" className="inline">
            <CurrencyField
              field="input"
              tokenName="WETH"
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={wethAmount}
            />
            <CurrencyField
              field="output"
              tokenName="UNI"
              value={outputAmount}
              signer={signer}
              balance={uniAmount}
              spinner={BeatLoader}
              loading={loading}
            />
          </div>
          <div name="RATIOCONTAINER" className="my-2">
            {ratio && <>{`Ratio: 1 UNI = ${ratio} WETH`}</>}
            {!ratio && <>Ratio:</>}
          </div>
          <div name="SWAPBUTTONCONTAINER" className="">
            {walletConnected ? (
              <button
                onClick={() =>
                  runSwap(transaction, signer, account, inputAmount)
                }
                name="SWAPBUTTON"
                className="bg-orange-500 flex justify-center rounded-2xl w-full py-2 text-white text-2xl hover:text-orange-500 hover:bg-red-100"
              >
                Swap
              </button>
            ) : (
              <button
                onClick={() => connect()}
                name="SWAPBUTTON"
                className="bg-orange-500 flex justify-center rounded-2xl w-full py-2 text-white text-2xl hover:text-orange-500 hover:bg-red-100"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>
      <footer className="flex flex-col ml-4 mt-36 font-sans font1">
        This version does not have wrapping function (yet). I kindly ask you to
        get Görli WETH from{" "}
        <a
          href="https://app.uniswap.org/#/swap"
          target="/blank"
          className="text-orange-500 font-bold underline"
        >
          the official Uniswap frontend.
        </a>{" "}
        <br />
        Do not interact with wallets that have real funds.
      </footer>
    </div>
  );
};

export const App = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <AppBody />
    </Web3ReactProvider>
  );
};

export default App;
