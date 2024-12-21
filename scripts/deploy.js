const hre = require("hardhat");

async function main() {
  const Storage = await hre.ethers.getContractFactory("Storage");
  const storage = await Storage.deploy();

  await storage.deployed();
  console.log("Storage contract deployed to:", storage.address);

  console.log("Retrieve value:", await storage.retrieve());
  
  console.log("Store value 100 in the contract...");
  const tx = await storage.store(50);
  await tx.wait();

  console.log("Retrieve value after storing:", await storage.retrieve());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});