ProofHunt 🏆 

The Ultimate On-Chain Game
Introduction
ProofHunt is an innovative decentralized game built on the Ethereum blockchain (specifically designed for Etherlink, leveraging its speed and low transaction costs). It challenges players to submit real-world "proofs" (e.g., photos, videos) based on a given challenge, vote on each other's submissions, and compete for reputation and unique NFT trophies. It's a social, competitive experience that brings real-world interaction onto the blockchain.

Problem Solved
Traditional online competitions often lack transparency, suffer from centralized control, and struggle with verifiable participation. ProofHunt addresses these issues by:

Decentralizing Proof: Submissions are on-chain, making them publicly verifiable and immutable.

Ensuring Fair Play: Voting is transparent and on-chain, preventing manipulation.

Rewarding True Engagement: Players earn reputation and unique NFT trophies for their participation and wins, fostering genuine ownership and bragging rights.

How ProofHunt Works - Overview
ProofHunt operates in rounds, managed by a Game Master (the contract owner).

Player Registration: New players connect their Ethereum wallet (e.g., MetaMask) and register a unique username and optional avatar. Their profile (username, avatar, score, registration status) is stored on the contract.

Starting a Round (Game Master): The contract owner initiates a new round by defining a challenge description (e.g., "Take a photo of your favorite landmark.") and a duration. This sets a countdown timer, during which players can submit proofs.

Submitting Proof: Registered players submit a proof URL (a link to an image/video) that fulfills the current challenge. All submissions are publicly displayed.

Voting: Players can vote on other players' proofs (once per round). Votes increase a submission's vote count.

Ending the Round: Once the timer expires, the Game Master ends the round. The contract automatically determines the winning submission based on the highest votes. The winner receives 100 score points and a unique Trophy NFT as a badge of honor.

Leaderboard & Player Profiles: Players can view their profile (username, avatar, score) and see a global leaderboard ranking players by score. Submissions and votes update in real-time.

Features
Decentralized Player Registration: On-chain profiles for all participants.

Dynamic Rounds: Game Master can launch new challenges with set durations.

On-Chain Proof Submissions: Players submit URLs, recorded immutably on the blockchain.

Transparent Voting System: Fair and verifiable voting on submissions.

Reputation System: Players earn "Cred Score" for winning rounds.

NFT Trophy Rewards: Winners receive unique ERC-721 NFTs as verifiable achievements.

Real-time Leaderboard: Track top players and their scores.

Responsive UI: Designed to work across various devices.

Robust Toast Notifications: Provides clear, accessible feedback to the user for all actions.

ProofHunt is a blockchain-powered treasure hunt game where players complete challenges and collect NFT trophies on-chain. Built using Hardhat, Etherlink (Tezos L2), and Ethers.js.
Future Enhancements
ERC-6551 Integration: Allow Trophy NFTs to hold other in-game assets or even other NFTs, making them dynamic character profiles.

Advanced Leaderboard: Implement a more robust leaderboard system, potentially using a subgraph or off-chain indexing for complex ranking logic and historical data.

Decentralized Storage for Proofs: Integrate IPFS for storing proof images directly, ensuring complete decentralization of content.

In-Game Chat/Social Features: Add a decentralized chat using protocols like XMTP to enhance player interaction and community building.

Multi-Round History: Display a history of past rounds, including winners and winning proofs.

Improved Error Handling: More user-friendly error messages and robust retry mechanisms for blockchain transactions.

Mobile Responsiveness: Further optimize the UI for a seamless experience on mobile devices.
## 🚀 Live Demo
[Live site (optional)]()

## 📽️ Demo Video
[Watch on YouTube](h



## 🔗 Sponsor Technology Used
- ✅ **Etherlink Testnet** for deployment and transactions
- ✅ **Google Cloud Credits (via partnership)** for potential frontend hosting

## 📂 Repo Structure

