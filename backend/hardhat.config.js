require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    etherlinkTestnet: {
      url: "https://node.ghostnet.etherlink.com",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};