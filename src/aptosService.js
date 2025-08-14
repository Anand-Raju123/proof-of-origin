import { AptosClient } from "aptos";

const NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";
const client = new AptosClient(NODE_URL);

const MODULE_ADDRESS = "9836f4f4da2beccd18cce050493c9245d216ff3a2ac62a70bad67e75a60a4496";

export async function recordDocument(wallet, ipfsHash, fileHash) {
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::chain_proof::record_document`,
    type_arguments: [],
    arguments: [ipfsHash, fileHash]
  };

  const transaction = await wallet.signAndSubmitTransaction(payload);
  await client.waitForTransaction(transaction.hash);
  return transaction.hash;
}
