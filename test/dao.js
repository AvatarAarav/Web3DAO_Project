const { expect } = require('chai');
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-toolbox/network-helpers");
  
describe('DAO Contract', () => {
  let dao;
  let owner;
  let member1;
  let member2;
  let nonMember;

  before(async () => {
    // Deploy the DAO contract and get some accounts
    [owner, member1, member2, nonMember] = await ethers.getSigners();
    const DAO = await ethers.getContractFactory('DAO'); // Replace 'DAO' with your contract name
    dao = await DAO.deploy();
    await dao.waitForDeployment();
  });

  it('Should allow the owner to add and remove members', async () => {
    await dao.addMember(member1.address);
    expect(await dao.members(member1.address)).to.equal(true);

    await dao.removeMember(member1.address);
    expect(await dao.members(member1.address)).to.equal(false);
  });

  it('Should allow members to propose and vote on messages', async () => {
    // Member1 proposes a message
    await dao.addMember(member1.address);
    await dao.addMember(member2.address);
    expect(await dao.members(member1.address)).to.equal(true);

    await dao.connect(member1).proposeMessage('Message from member 1');
    const proposalId = 0;
    var proposal1 = await dao.proposals(proposalId);

    // Check proposal state after proposal
    expect(proposal1.proposer).to.equal(member1.address);
    expect(proposal1.voteCount).to.equal(0);

    // Member2 votes for the proposal
    await dao.connect(member2).vote(proposalId);
    proposal1 =  await dao.proposals(proposalId);
    expect(proposal1.voteCount).to.equal(1);

    // Non-member tries to vote (should fail)
    await expect(dao.connect(nonMember).vote(proposalId)).to.be.revertedWith('Only members can call this function');
  });


});
