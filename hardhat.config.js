/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
const ALCHEMY_API_KEY = "UJ8kOC56n3NXZdnzYraburlXj6n6ei34";
const SEPHOLIA_PRIVATE_KEY = "e585c6306c1cf8c76ad3ea64e59498f1b3c4c570a331e1edc47702d377f87859";
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepholia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/UJ8kOC56n3NXZdnzYraburlXj6n6ei34`,
      accounts: [SEPHOLIA_PRIVATE_KEY]
    }
  }
};
