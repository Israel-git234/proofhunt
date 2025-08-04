// backend/contracts/ProofHunt.sol (Corrected)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TrophyNFT.sol";

contract ProofHunt is Ownable {
    TrophyNFT public trophyContract;

    struct Player {
        string username;
        string avatarUrl;
        uint256 score;
        bool isRegistered;
    }

    struct Submission {
        uint256 id;
        uint256 roundId;
        address player;
        string proofUrl;
        uint256 voteCount;
    }

    struct Round {
        uint256 id;
        string challenge;
        uint256 endTime;
        bool isFinalized;
        address winner;
        uint256 winningSubmissionId;
    }

    mapping(address => Player) public players;
    mapping(uint256 => Round) public rounds;
    mapping(uint256 => Submission) public submissions;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public roundCounter;
    uint256 public submissionCounter;

    event PlayerRegistered(address indexed player, string username);
    event RoundStarted(uint256 indexed roundId, string challenge, uint256 endTime);
    event ProofSubmitted(uint256 indexed submissionId, uint256 indexed roundId, address indexed player, string proofUrl);
    event Voted(uint256 indexed submissionId, address indexed voter);
    event RoundEnded(uint256 indexed roundId, address indexed winner, uint256 winningSubmissionId);

    constructor(address _trophyContractAddress, address initialOwner) Ownable(initialOwner) {
        trophyContract = TrophyNFT(_trophyContractAddress);
    }

    function register(string calldata _username, string calldata _avatarUrl) external {
        require(!players[msg.sender].isRegistered, "Player already registered");
        require(bytes(_username).length > 0, "Username cannot be empty");
        players[msg.sender] = Player(_username, _avatarUrl, 0, true);
        emit PlayerRegistered(msg.sender, _username);
    }

    function startRound(string calldata _challenge, uint256 _durationSeconds) external onlyOwner {
        if (roundCounter > 0) {
            require(rounds[roundCounter].isFinalized, "Previous round not finalized");
        }
        roundCounter++;
        rounds[roundCounter] = Round({
            id: roundCounter,
            challenge: _challenge,
            endTime: block.timestamp + _durationSeconds,
            isFinalized: false,
            winner: address(0),
            winningSubmissionId: 0
        });
        emit RoundStarted(roundCounter, _challenge, rounds[roundCounter].endTime);
    }

    function submitProof(string calldata _proofUrl) external {
        require(players[msg.sender].isRegistered, "Player not registered");
        Round storage currentRound = rounds[roundCounter];
        require(block.timestamp < currentRound.endTime, "Round has ended");
        require(!currentRound.isFinalized, "Round is finalized");

        submissionCounter++;
        submissions[submissionCounter] = Submission(submissionCounter, roundCounter, msg.sender, _proofUrl, 0);
        emit ProofSubmitted(submissionCounter, roundCounter, msg.sender, _proofUrl);
    }

    function voteOnSubmission(uint256 _submissionId) external {
        require(players[msg.sender].isRegistered, "Player not registered");
        Submission storage submission = submissions[_submissionId];
        require(submission.id!= 0, "Submission does not exist");
        require(submission.roundId == roundCounter, "Submission not from current round");
        require(submission.player!= msg.sender, "Cannot vote for your own submission");
        require(!hasVoted[roundCounter][msg.sender], "You have already voted this round");

        Round storage currentRound = rounds[roundCounter];
        require(block.timestamp < currentRound.endTime, "Round has ended");

        submission.voteCount++;
        hasVoted[roundCounter][msg.sender] = true;
        emit Voted(_submissionId, msg.sender);
    }

    function endRound() external onlyOwner {
        Round storage currentRound = rounds[roundCounter];
        require(!currentRound.isFinalized, "Round already finalized");
        require(block.timestamp >= currentRound.endTime, "Round has not ended yet");

        uint256 winningSubmissionId = 0;
        uint256 maxVotes = 0;

        for (uint256 i = 1; i <= submissionCounter; i++) {
            if (submissions[i].roundId == roundCounter) {
                if (submissions[i].voteCount > maxVotes) {
                    maxVotes = submissions[i].voteCount;
                    winningSubmissionId = i;
                }
            }
        }

        currentRound.isFinalized = true;

        if (winningSubmissionId!= 0) {
            // *** THIS IS THE CORRECTED LINE ***
            address winner = submissions[winningSubmissionId].player;


            currentRound.winner = winner;
            currentRound.winningSubmissionId = winningSubmissionId;
            players[winner].score += 100;

            string memory tokenURI = "https://raw.githubusercontent.com/your-username/your-repo/main/metadata/trophy.json"; // Placeholder
            trophyContract.awardTrophy(winner, tokenURI);
        }

        emit RoundEnded(roundCounter, currentRound.winner, winningSubmissionId);
    }
}