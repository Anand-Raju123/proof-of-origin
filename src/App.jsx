import './App.css';
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useState } from 'react';

const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [fileData, setFileData] = useState(null);
  const [result, setResult] = useState("");
  
  // Replace with your Move module address & function
  const MODULE_ADDRESS = "0xYOUR_MODULE_ADDRESS";

  // Simulated ML detection
  const detectDefect = async (file) => {
    // In real project, you'll send the file to your ML backend API
    return file.name.includes("defect") ? "Defective Track" : "Good Track";
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setFileData(file);
    const detectionResult = await detectDefect(file);
    setResult(detectionResult);
  };

  const submitResultToBlockchain = async () => {
    if (!account || !result) return;

    const transaction = {
      data: {
        function: `${MODULE_ADDRESS}::trackDetection::store_result`,
        functionArguments: [result]
      }
    };

    const response = await signAndSubmitTransaction(transaction);
    await aptos.waitForTransaction({ transactionHash: response.hash });
    console.log("Result stored on blockchain", response);
  };

  return (
    <>
      {/* Top bar */}
      <div className="flex justify-between items-center px-12 py-6">
        <h1 className="text-xl font-bold">Train Track Defect Detection</h1>
        <WalletSelector />
      </div>

      <hr />

      {/* Upload & Detection */}
      <div className="flex flex-col items-center my-16">
        <input 
          type="file" 
          accept=".csv" 
          className="mb-4"
          onChange={handleFileUpload}
        />
        {result && (
          <div className="text-lg mb-4">
            Detection Result: <span className="font-bold">{result}</span>
          </div>
        )}
        <button
          className="border px-4 py-2 rounded hover:bg-black hover:text-white border-black"
          onClick={submitResultToBlockchain}
          disabled={!result}
        >
          Submit Result to Blockchain
        </button>
      </div>
    </>
  );
}

export default App;
