const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  let provider = new ethers.JsonRpcProvider(process.env.RPC_SERVER);
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying,Please wait...");
  const contract = await contractFactory.deploy();
  const transactionReceipt = await contract.deploymentTransaction().wait(1);

  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`);
  const transactionResponse = await contract.store("10");
  await contract.deploymentTransaction().wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Current favorite number: ${updatedFavoriteNumber.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
