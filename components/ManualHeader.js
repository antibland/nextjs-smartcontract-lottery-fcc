import { useEffect } from "react";
import { useMoralis } from "react-moralis";

export default function ManualHeader() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    isWeb3EnableLoading,
    Moralis,
    deactivateWeb3,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;

    if (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    ) {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);

      if (account == null) {
        if (
          typeof window !== "undefined" &&
          typeof window.localStorage !== "undefined"
        ) {
          window.localStorage.removeItem("connected");
          deactivateWeb3();
          console.log("No account found");
        }
      }
    });
  }, []);
  return (
    <div>
      {account ? (
        <>
          Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </>
      ) : (
        <button
          disabled={isWeb3EnableLoading}
          type="button"
          onClick={async () => {
            await enableWeb3();
            if (
              typeof window !== "undefined" &&
              typeof window.localStorage !== "undefined"
            ) {
              window.localStorage.setItem("connected", "injected");
            }
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
}
