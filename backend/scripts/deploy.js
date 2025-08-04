// backend/scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy TrophyNFT contract
  const TrophyNFT = await ethers.getContractFactory("TrophyNFT");
  const trophyNFT = await TrophyNFT.deploy(deployer.address);
  await trophyNFT.waitForDeployment();
  const trophyNFTAddress = await trophyNFT.getAddress();
  console.log(`TrophyNFT contract deployed to: ${trophyNFTAddress}`);

  // 2. Deploy ProofHunt contract, linking it to the TrophyNFT contract
  const ProofHunt = await ethers.getContractFactory("ProofHunt");
  const proofHunt = await ProofHunt.deploy(trophyNFTAddress, deployer.address);
  await proofHunt.waitForDeployment();
  const proofHuntAddress = await proofHunt.getAddress();
  console.log(`ProofHunt contract deployed to: ${proofHuntAddress}`);

  // 3. Grant minting permission from TrophyNFT to ProofHunt contract
  console.log("Setting ProofHunt contract address in TrophyNFT...");
  const tx = await trophyNFT.setProofHuntContract(proofHuntAddress);
  await tx.wait();
  console.log("Permission granted. Deployment and setup complete.");
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
  });