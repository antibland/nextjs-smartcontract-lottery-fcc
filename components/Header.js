import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <header className="border-b-2 border-gray-500 py-4 flex justify-between items-center">
      <h1 className="m-0">Decentralized Lottery</h1>
      <ConnectButton moralisAuth={false} />
    </header>
  );
}
