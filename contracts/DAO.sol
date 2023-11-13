// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Token.sol";  // Import the MyToken contract

contract DAO {
    address public owner;
    uint256 public proposalCount;
    uint256 public memberCount;
    uint256 public acceptedProporsalsIdsCount;
    uint256 public joinRequestCount;
    Token public tokenContract;  // Reference to the MyToken contract

    struct Proposal {
        uint256 id;
        string message;
        address proposer;
        uint256 voteCount;
        bool posted;
        mapping(address => uint256) voters;
    }

    Proposal[] public proposals;
    uint256[] public acceptedProporsalsIds;
    address[] public joinRequests;

    mapping(address => bool) public members;
    mapping(address => uint256) public lastIdeaPosted;
    mapping(address => uint256) public lastRewardDistribTime;
    mapping(address => string) public joinRequestString;

    event ProposalCreatedEvent(uint256 proposalId, string message, address proposer);
    event Voted(uint256 proposalId, address voter);
    event TokenUpdated(string message);
    event ProposalPassed(uint256 proposalId);
    event MembersUpdated(string message);
    event JoiningReqEvent(string message);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyMembers() {
        require(members[msg.sender], "Only members can call this function");
        _;
    }

    constructor(Token _tokenContract) {
        owner = msg.sender;
        tokenContract = _tokenContract;  // Initialize the MyToken contract
        members[msg.sender] = true;
        lastIdeaPosted[msg.sender] = block.timestamp;
        memberCount = 1;
        lastRewardDistribTime[msg.sender] = block.timestamp;
        proposalCount = 0;
        joinRequestCount = 0;
        acceptedProporsalsIdsCount = 0;
    }

    function provideStayingReward() public {
        // uint interval=604800; //7 days
        uint interval=60; //1min
        if(lastRewardDistribTime[msg.sender]+interval<block.timestamp) {
            tokenContract.mint(msg.sender,50);
            lastRewardDistribTime[msg.sender]=block.timestamp;
        }
    }
    function slashingLazyPenality()public{
        // uint interval=129600; //1.5 days
        // uint penalityTime=86400; //1 day

        uint interval=120; //2min
        uint penalityTime=60; //1min 
        if(lastIdeaPosted[msg.sender]+interval<block.timestamp){ 
            uint256 penality=10*(block.timestamp-lastIdeaPosted[msg.sender])/penalityTime;
            uint256 balance=tokenContract.balanceOf(msg.sender);
            if(balance>penality){
                tokenContract.burn(msg.sender,penality);
            }
            else{
                tokenContract.burn(msg.sender,balance);
            }
            lastIdeaPosted[msg.sender]=block.timestamp;
        }  
    }
    function updateUserBalance()public onlyMembers{
        provideStayingReward(); //Giving reward for staying 
        slashingLazyPenality();//Slashing on Not posting Idea
        emit TokenUpdated("Tokens have been Updated");
    }

    function returnBalance(address add)public view returns(uint256){
        return tokenContract.checkBalance(add);
    }

    function addMember(address _member) public onlyOwner {
        require(members[_member]==false,"Already a Member");
        memberCount++;
        members[_member] = true;
        tokenContract.mint(_member,100);
        lastIdeaPosted[_member]=block.timestamp;
        emit MembersUpdated("Member Added");
    }

    function removeMember(address _member) public onlyOwner {
        require(members[_member]==true,"Not a Member anyway");
        memberCount--;
        members[_member] = false;
        emit MembersUpdated("Member Removed");
    }

    function addJoinRequest(string memory _message) public{
        if(keccak256(bytes(joinRequestString[msg.sender]))==keccak256(bytes(""))){
            joinRequestCount++;
            joinRequests.push(msg.sender);
        }
        joinRequestString[msg.sender]=_message;
        emit JoiningReqEvent(_message);
    }

    function proposeMessage(string memory _message) public onlyMembers {
        require(bytes(_message).length > 0, "Message cannot be empty");
        uint256 newProposalId = proposalCount++;
        Proposal storage newProposal = proposals.push();
        newProposal.id = newProposalId;
        newProposal.message = _message;
        newProposal.posted = false;
        newProposal.proposer = msg.sender;
        lastIdeaPosted[msg.sender]=block.timestamp;
        tokenContract.mint(msg.sender, 5);
        emit ProposalCreatedEvent(newProposalId, _message, msg.sender);
    }

    function vote(uint256 _proposalId) public onlyMembers {
        require(_proposalId < proposalCount, "Invalid proposal ID");
        require(proposals[_proposalId].posted==false,"Proporsal already posted");
        Proposal storage proposal = proposals[_proposalId];

        
        uint256 required_balance=(proposal.voters[msg.sender]**2)+1;
        
        require(tokenContract.balanceOf(msg.sender)>required_balance,"Not Enough Tokens");
        tokenContract.burn(msg.sender,required_balance);
        proposal.voters[msg.sender]++;
        proposal.voteCount++;

        emit Voted(_proposalId, msg.sender);

        if (proposal.voteCount * 2 > memberCount) {
            emit ProposalPassed(_proposalId);
            proposals[_proposalId].posted=true;
            acceptedProporsalsIds.push(_proposalId);
            acceptedProporsalsIdsCount++;
        }
    }
    function votePrize(address voter,uint256 proposalId)public view onlyMembers returns(uint){
        return (proposals[proposalId].voters[voter]**2)+1;
    }



}