// backend/contracts/TrophyNFT.sol (Corrected)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TrophyNFT
 * @dev A simple ERC721 contract to mint unique trophies for ProofHunt winners.
 * The ProofHunt contract is the only one authorized to mint new trophies.
 */
contract TrophyNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // The address of the main ProofHunt game contract.
    address public proofHuntContract;

    // Modifier to ensure only the ProofHunt contract can call a function.
    modifier onlyProofHunt() {
        require(msg.sender == proofHuntContract, "Caller is not the ProofHunt contract");
        _;
    }

    constructor(address initialOwner) ERC721("ProofHunt Trophy", "PHT") Ownable(initialOwner) {}

    /**
     * @dev Sets the address of the main game contract. Can only be called once by the owner.
     * @param _proofHuntContract The address of the deployed ProofHunt contract.
     */
    function setProofHuntContract(address _proofHuntContract) external onlyOwner {
        require(proofHuntContract == address(0), "ProofHunt contract already set");
        proofHuntContract = _proofHuntContract;
    }

    /**
     * @dev Mints a new trophy NFT and assigns it to the winner.
     * This function can only be called by the ProofHunt contract.
     * @param winner The address of the player who won the round.
     * @param tokenURI A URI pointing to the NFT's metadata (e.g., an image).
     * @return The ID of the newly minted token.
     */
    function awardTrophy(address winner, string memory tokenURI) external onlyProofHunt returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(winner, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }
}