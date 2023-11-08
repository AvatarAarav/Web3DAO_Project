// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const DAO = await ethers.getContractFactory("DAO");
  const dao = await DAO.deploy();
  await dao.deployed();

  console.log("DAO Contract address:", dao.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(dao);
}

function saveFrontendFiles(dao) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ DAO: dao.address }, undefined, 2)
  );

  const DAOArtifact = artifacts.readArtifactSync("DAO");

  fs.writeFileSync(
    path.join(contractsDir, "DAO.json"),
    JSON.stringify(DAOArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
