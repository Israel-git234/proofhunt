// Main logic for ProofHunt frontend

const { ethers } = window;
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
let signer;
let userAddress;

const PROOFHUNT_ADDRESS = "0x31AFeFC044E1D2E9ac0A993BA19D55282Ff52b56"; // replace with your deployed ProofHunt address
const TROPHYNFT_ADDRESS = "0x27443120503d8cDb29d5C0310CC5feE74017C18E"; // replace with your deployed TrophyNFT address

// Paste your ABI JSON objects here:
const proofHuntABI = [
{
      "inputs": [
        {
          "internalType": "address",
          "name": "_trophyContractAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "initialOwner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "username",
          "type": "string"
        }
      ],
      "name": "PlayerRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "submissionId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "proofUrl",
          "type": "string"
        }
      ],
      "name": "ProofSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "winningSubmissionId",
          "type": "uint256"
        }
      ],
      "name": "RoundEnded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "challenge",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        }
      ],
      "name": "RoundStarted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "submissionId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        }
      ],
      "name": "Voted",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "endRound",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasVoted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "players",
      "outputs": [
        {
          "internalType": "string",
          "name": "username",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "avatarUrl",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "score",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isRegistered",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_username",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_avatarUrl",
          "type": "string"
        }
      ],
      "name": "register",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "roundCounter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "rounds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "challenge",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isFinalized",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "winningSubmissionId",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_challenge",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_durationSeconds",
          "type": "uint256"
        }
      ],
      "name": "startRound",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "submissionCounter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "submissions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "proofUrl",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_proofUrl",
          "type": "string"
        }
      ],
      "name": "submitProof",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "trophyContract",
      "outputs": [
        {
          "internalType": "contract TrophyNFT",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_submissionId",
          "type": "uint256"
        }
      ],
      "name": "voteOnSubmission",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

// 🔻 TrophyNFT ABI
const trophyNFTABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "initialOwner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_fromTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_toTokenId",
          "type": "uint256"
        }
      ],
      "name": "BatchMetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "MetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "tokenURI",
          "type": "string"
        }
      ],
      "name": "awardTrophy",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proofHuntContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_proofHuntContract",
          "type": "address"
        }
      ],
      "name": "setProofHuntContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

let proofHuntContract;
let trophyNFTContract;

const connectButton = document.getElementById("connectButton");
const registerModal = document.getElementById("register-modal");
const registerButton = document.getElementById("register-button");
const usernameInput = document.getElementById("username-input");
const avatarInput = document.getElementById("avatar-input");
const gameContent = document.getElementById("game-content");
const submissionArea = document.getElementById("submission-area");
const proofUrlInput = document.getElementById("proof-url-input");
const submitButton = document.getElementById("submit-button");
const totalPlayersEl = document.getElementById("total-players");
const totalRoundsEl = document.getElementById("total-rounds");
const totalSubmissionsEl = document.getElementById("total-submissions");
const challengePrompt = document.getElementById("challenge-prompt");
const timerEl = document.getElementById("timer");
const submissionsList = document.getElementById("submissions-list");
const profileUsername = document.getElementById("profile-username");
const profileAvatar = document.getElementById("profile-avatar");
const profileCredScore = document.getElementById("profile-cred-score");
const profileRank = document.getElementById("profile-rank");
const leaderboardEl = document.getElementById("leaderboard");
const gmPanel = document.getElementById("gm-panel");
const newChallengeInput = document.getElementById("new-challenge-input");
const durationInput = document.getElementById("duration-input");
const startRoundButton = document.getElementById("start-round-button");
const endRoundButton = document.getElementById("end-round-button");
const endRoundPanel = document.getElementById("end-round-panel");

let currentRoundEndTime = 0;
let countdownInterval;

function showToast(message) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

async function connectWallet() {
  if (!window.ethereum) {
    showToast("MetaMask not detected! Please install it.");
    return;
  }
  try {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    proofHuntContract = new ethers.Contract(PROOFHUNT_ADDRESS, proofHuntABI, signer);
    trophyNFTContract = new ethers.Contract(TROPHYNFT_ADDRESS, trophyNFTABI, signer);

    showToast("Wallet connected!");
    connectButton.style.display = "none";
    await loadPlayer();
    gameContent.classList.remove("hidden");

    // If player not registered, show register modal
    if (!(await isPlayerRegistered())) {
      registerModal.classList.remove("hidden");
    } else {
      submissionArea.classList.remove("hidden");
    }

    // Show GM panel if owner
    if (await isOwner()) {
      gmPanel.classList.remove("hidden");
    }

    setupEventListeners();
    startRoundTimer();

    // Update all stats on load
    await refreshStats();

  } catch (error) {
    console.error(error);
    showToast("Failed to connect wallet.");
  }
}

async function isPlayerRegistered() {
  try {
    const player = await proofHuntContract.players(userAddress);
    return player.isRegistered;
  } catch {
    return false;
  }
}

async function isOwner() {
  try {
    const owner = await proofHuntContract.owner();
    return owner.toLowerCase() === userAddress.toLowerCase();
  } catch {
    return false;
  }
}

async function registerPlayer() {
  const username = usernameInput.value.trim();
  const avatarUrl = avatarInput.value.trim();

  if (!username) {
    showToast("Please enter a username.");
    return;
  }

  try {
    registerButton.disabled = true;
    const tx = await proofHuntContract.register(username, avatarUrl);
    await tx.wait();
    showToast("Registration successful!");
    registerModal.classList.add("hidden");
    submissionArea.classList.remove("hidden");
    await loadPlayer();
  } catch (error) {
    console.error(error);
    showToast("Registration failed.");
  } finally {
    registerButton.disabled = false;
  }
}

async function loadPlayer() {
  try {
    const player = await proofHuntContract.players(userAddress);
    profileUsername.textContent = player.username || "Hunter";
    profileCredScore.textContent = player.score.toString();

    // Update avatar or fallback icon
    if (player.avatarUrl && player.avatarUrl !== "") {
      profileAvatar.innerHTML = `<img src="${player.avatarUrl}" alt="Avatar" />`;
    } else {
      profileAvatar.innerHTML = '<i class="fas fa-user"></i>';
    }

    // TODO: Fetch & display rank, can be added from leaderboard
  } catch (error) {
    console.error(error);
  }
}

async function refreshStats() {
  try {
    // For demo, let's assume some getter functions or counters exist
    // If your contract has no public counters, you might need to add view functions
    const roundsCount = await proofHuntContract.roundCounter();
    totalRoundsEl.textContent = roundsCount.toString();

    // Update total players - no mapping length in solidity, so you might need an off-chain source or event count
    // For demo, just show placeholder or track in contract
    totalPlayersEl.textContent = "-";

    // Total submissions count
    // Use submissionCounter if public
    const submissionsCount = await proofHuntContract.submissionCounter();
    totalSubmissionsEl.textContent = submissionsCount.toString();

    // Update current round data (challenge & timer)
    const currentRound = await proofHuntContract.rounds(roundsCount);
    if (currentRound && !currentRound.isFinalized) {
      challengePrompt.textContent = currentRound.challenge;
      currentRoundEndTime = currentRound.endTime.toNumber();
    } else {
      challengePrompt.textContent = "Waiting for the next epic challenge...";
      currentRoundEndTime = 0;
    }

    await loadSubmissions(roundsCount);
    await loadLeaderboard();
  } catch (error) {
    console.error(error);
  }
}

async function loadSubmissions(roundId) {
  try {
    submissionsList.innerHTML = "";
    const submissionsCount = await proofHuntContract.submissionCounter();

    let foundAny = false;
    for (let i = 1; i <= submissionsCount; i++) {
      const submission = await proofHuntContract.submissions(i);
      if (submission.roundId.toNumber() === roundId) {
        foundAny = true;
        const el = document.createElement("div");
        el.className = "submission-item";
        el.innerHTML = `
          <img src="${submission.proofUrl}" alt="Proof Image" onerror="this.src='https://via.placeholder.com/48x48?text=No+Image';" />
          <div><strong>${submission.player.slice(0, 6)}...${submission.player.slice(-4)}</strong></div>
          <div>Votes: ${submission.voteCount.toNumber()}</div>
          <button class="btn-primary vote-btn" data-id="${submission.id.toNumber()}">Vote</button>
        `;
        submissionsList.appendChild(el);
      }
    }
    if (!foundAny) {
      submissionsList.innerHTML = "<p>No submissions yet.</p>";
    }

    // Add vote listeners
    document.querySelectorAll(".vote-btn").forEach((btn) => {
      btn.onclick = voteOnSubmission;
    });
  } catch (error) {
    console.error(error);
  }
}

async function voteOnSubmission(event) {
  const btn = event.target;
  const submissionId = btn.getAttribute("data-id");

  try {
    btn.disabled = true;
    showToast("Submitting your vote...");
    const tx = await proofHuntContract.voteOnSubmission(submissionId);
    await tx.wait();
    showToast("Vote counted!");
    await refreshStats();
  } catch (error) {
    console.error(error);
    showToast("Failed to vote.");
  } finally {
    btn.disabled = false;
  }
}

function updateTimer() {
  if (!currentRoundEndTime) {
    timerEl.textContent = "00:00";
    return;
  }
  const now = Math.floor(Date.now() / 1000);
  let diff = currentRoundEndTime - now;

  if (diff <= 0) {
    timerEl.textContent = "00:00";
    clearInterval(countdownInterval);
    // Optionally: refresh stats after round ends
    refreshStats();
    return;
  }
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  timerEl.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Blink red timer if less than 10 seconds left
  if (diff < 10) {
    timerEl.style.color = diff % 2 === 0 ? "#ff5555" : "#fff";
  } else {
    timerEl.style.color = "#00f6ff";
  }
}

function startRoundTimer() {
  clearInterval(countdownInterval);
  countdownInterval = setInterval(updateTimer, 1000);
  updateTimer();
}

async function submitProof() {
  const proofUrl = proofUrlInput.value.trim();
  if (!proofUrl) {
    showToast("Please enter proof URL.");
    return;
  }
  try {
    submitButton.disabled = true;
    showToast("Submitting proof...");
    const tx = await proofHuntContract.submitProof(proofUrl);
    await tx.wait();
    showToast("Proof submitted!");
    proofUrlInput.value = "";
    await refreshStats();
  } catch (error) {
    console.error(error);
    showToast("Failed to submit proof.");
  } finally {
    submitButton.disabled = false;
  }
}

async function loadLeaderboard() {
  leaderboardEl.innerHTML = "<p>Loading leaderboard...</p>";

  // Demo: since you don't have a direct leaderboard mapping, you can:
  // - Fetch from off-chain event logs
  // - Or loop players if you store them on chain
  // For simplicity, just placeholder

  // You can replace this with your own logic
  leaderboardEl.innerHTML = `<p>Leaderboard loading not implemented.</p>`;
}

async function startRound() {
  const challenge = newChallengeInput.value.trim();
  const duration = parseInt(durationInput.value);

  if (!challenge || !duration || duration <= 0) {
    showToast("Please enter valid challenge and duration.");
    return;
  }

  try {
    startRoundButton.disabled = true;
    showToast("Starting new round...");
    const tx = await proofHuntContract.startRound(challenge, duration);
    await tx.wait();
    showToast("Round started!");
    newChallengeInput.value = "";
    durationInput.value = "";
    await refreshStats();
  } catch (error) {
    console.error(error);
    showToast("Failed to start round.");
  } finally {
    startRoundButton.disabled = false;
  }
}

async function endRound() {
  try {
    endRoundButton.disabled = true;
    showToast("Ending round...");
    const tx = await proofHuntContract.endRound();
    await tx.wait();
    showToast("Round ended and winner crowned!");
    await refreshStats();
  } catch (error) {
    console.error(error);
    showToast("Failed to end round.");
  } finally {
    endRoundButton.disabled = false;
  }
}

function setupEventListeners() {
  submitButton.onclick = submitProof;
  registerButton.onclick = registerPlayer;
  startRoundButton.onclick = startRound;
  endRoundButton.onclick = endRound;
}

connectButton.onclick = connectWallet;

// Optional: refresh stats every 30 seconds to keep UI updated
setInterval(refreshStats, 30000);
