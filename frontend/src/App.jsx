import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import DAOArtifact from "./contracts/DAO.json";
import contractAddress from "./contracts/contract-address.json";
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import Owner from "./Owner";
import Member from "./Member";
import NonMember from "./NonMember";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAddress, setBalance, setDAO, setError, setDisabled } from "./store/userSlice";
import { setProporsals, setAcceptedProporsals, setJoinedProporsals } from "./store/userSlice";


const HARDHAT_NETWORK_ID = '31337';
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
let globalDAO
let globalAddress
const App = () => {
  const dispatch = useDispatch()
  const [userData, setUserData] = useState({
    isOwner: false,
    isMember: false
  });
  const userDAO = useSelector(state => state.user.dao)
  const selectedAddress = useSelector((state) => state.user.selectedAddress)
  const balance = useSelector((state => state.user.balance))
  const Error = useSelector(state => state.user.error)
  const [activeMembers, setActiveMembers] = useState(0);

  const initialState = {
    UserData: {
      isOwner: false,
      isMember: false
    },
    selectedAddress: undefined,
    balance: undefined,
    networkError: undefined,
  };

  const resetState = () => {
    setUserData(initialState.UserData);
    dispatch(setSelectedAddress(initialState.selectedAddress))
    dispatch(setBalance(initialState.balance))
    dispatch(setError(initialState.networkError))
  };

  const dismissNetworkError = () => {
    dispatch(setError(undefined))
  };

  const getRpcErrorMessage = (error) => {
    if (error.data) {
      return error.data.message;
    }
    return error.message;
  };

  const switchChain = async () => {
    const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`;
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    await initialize(selectedAddress);
  };

  const checkNetwork = () => {
    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
      switchChain();
    }
  };
  const updateBalance = async () => {
    console.log('het')
    const dao = globalDAO
    const address = globalAddress
    const balance = await dao.returnBalance(address);
    dispatch(setBalance(balance))
  };
  const updateActiveMembers = async () => {
    const dao = globalDAO
    setActiveMembers(await dao.memberCount())
  };
  const fetchProporsals = async () => {
    const userDAO = globalDAO
    const selectedAddress = globalAddress
    const proposalCount = await userDAO.proposalCount();
    const tempArray = []
    for (var i = proposalCount - 1; i >= 0; i--) {

      let tempProp = await userDAO.proposals(i);
      const prize = await userDAO.votePrize(selectedAddress, i)
      tempProp = { prize, ...tempProp }
      tempArray.push(tempProp)
    }
    dispatch(setProporsals(tempArray))
  }

  const fetchAcceptedProporsals = async () => {
    const userDAO = globalDAO
    const proposalCount = await userDAO.acceptedProporsalsIdsCount();
    const tempArray = []
    for (var i = proposalCount - 1; i >= 0; i--) {
      const tempPropId = await userDAO.acceptedProporsalsIds(i);
      const tempProp = await userDAO.proposals(tempPropId);
      tempArray.push(tempProp)
    }
    dispatch(setAcceptedProporsals(tempArray))
  }
  const fetchJoinRequests = async () => {
    const userDAO = globalDAO
    const requestCount = await userDAO.joinRequestCount();
    const tempArray = []
    for (var i = requestCount - 1; i >= 0; i--) {
      const tempAddress = await userDAO.joinRequests(i)
      const tempProp = await userDAO.joinRequestString(tempAddress);

      tempArray.push({ proposer: tempAddress, message: tempProp })
    }
    dispatch(setJoinedProporsals(tempArray))
  }
  const listenEvents = (dao) => {
    dao.on('TokenUpdated', () => updateBalance())
    dao.on('ProposalCreatedEvent', () => { fetchProporsals(); updateBalance() })
    dao.on('Voted', () => { fetchProporsals(); updateBalance() })
    dao.on('ProposalPassed', () => { fetchAcceptedProporsals() })
    dao.on('MembersUpdated', () => updateActiveMembers())
    dao.on('JoiningReqEvent', () => fetchJoinRequests())
  }
  const initializeEthers = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const dao = new ethers.Contract(
      contractAddress.DAO,
      DAOArtifact.abi,
      provider.getSigner(0)
    );
    return { provider, dao };
  };

  const getUserData = async (dao, address) => {
    const owner = await dao.owner();
    if (owner.toLowerCase() == address.toLowerCase()) {
      setUserData({ isMember: true, isOwner: true })
    }
    else if (await dao.members(address)) {
      setUserData({ isOwner: false, isMember: true })
    }
    else {
      setUserData({ isOwner: false, isMember: false })
    }
  };

  let provider_temp;


  const connectWallet = async () => {
    try {
      const [address] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!address) {
        resetState();
        return;
      }

      checkNetwork();

      const { provider, dao } = await initializeEthers(); //getting the blank DAO and metamask provider
      dispatch(setSelectedAddress(address))
      const userDao = dao.connect(provider.getSigner(0)); //connecting contract to user
      globalDAO = userDao
      globalAddress = address
      updateActiveMembers(userDao)
      dispatch(setDAO(userDao))
      getUserData(userDao, address);
      listenEvents(userDao)
      updateBalance();
      window.ethereum.on("accountsChanged", async ([address]) => {
        if (!address) {
          resetState();
          return;
        }
        dispatch(setSelectedAddress(address))
        checkNetwork();
        const { provider, dao } = await initializeEthers();
        const userDao = dao.connect(provider.getSigner(0));
        globalDAO = userDao
        globalAddress = address
        updateActiveMembers(userDao)
        dispatch(setDisabled(true))
        dispatch(setDAO(userDao))
        getUserData(userDao, address);
        updateBalance();
      });

    } catch (error) {
      console.error(error);
      dispatch(setError(error))
    }
  };

  useEffect(() => {
    if (window.ethereum === undefined) {
      return;
    }

    if (!selectedAddress) {
      connectWallet();
    }

    return () => {
      // Cleanup logic if needed
    };
  }, [selectedAddress]);

  useEffect(() => {
    if (selectedAddress) {
      checkNetwork();
    }
  }, [selectedAddress]);
  return (
    <>
      <nav className="navbar navbar-dark bg-primary">
        <div className="text-center w-100">
          <h1 className="display-2 fw-bold text-dark" href="#">SILLY DAO &#128540;</h1>
          <h6 className="text-dark">Active Members:{parseInt(activeMembers._hex, 16)}</h6>
          <button type="button" class="btn btn-dark" data-mdb-toggle="modal" data-mdb-target="#exampleModal">
            RULES
          </button>

        </div>

      </nav>
      {/*  Modal  */}
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Not So Silly Rules of Silly DAO</h5>
              <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <ul class="list-group">
                <li class="list-group-item">Only Silly Peoples are Allowed here</li>
                <li class="list-group-item list-group-item-primary">You have to post 1 idea everyday</li>
                <li class="list-group-item list-group-item-secondary">On every login, You have to update your Tokens count</li>
                <li class="list-group-item list-group-item-success">You will be provided 50 token after every 7 days</li>
                <li class="list-group-item list-group-item-danger">You will lose 10 tokens for each day of not posting</li>
                <li class="list-group-item list-group-item-warning">Proposed Idea will be accepted after getting more than 50% votes</li>
                <li class="list-group-item list-group-item-info">Once Idea is accepted, You have to post it to your social media accounts</li>
                <li class="list-group-item list-group-item-light">On every idea posted, You will get 5 tokens</li>
                <li class="list-group-item list-group-item-dark">Exponential Voting is used everywhere</li>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-mdb-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        {window.ethereum === undefined ? (
          <NoWalletDetected />
        ) : !selectedAddress ? (
          <ConnectWallet
            connectWallet={connectWallet}
            networkError={Error}
            dismiss={dismissNetworkError}
          />
        ) : !userData || !balance ? (
          <Loading />
        ) : (
          <div>
            {
              userData.isOwner ? <Owner /> : userData.isMember ? <Member /> : <NonMember />

            }
          </div>
        )}
      </div>
    </>
  );
};

export default App;
