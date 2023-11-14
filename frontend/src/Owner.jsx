import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddMember from './AddMember'
import RemoveMember from './RemoveMember'
import Proposals from './Proposals'
import ProposeForm from './ProposeForm'
import AcceptedProporsals from './AcceptedProporsals'
import JoinRequests from './JoinRequests'
import { setDisabled, setError } from './store/userSlice'


function Owner () {
  const dispatch=useDispatch();
  const  userDAO = useSelector(state=>state.user.dao)
  const selectedAddress=useSelector((state)=>state.user.selectedAddress)
  const balance=useSelector((state=>state.user.balance))
  const disabled=useSelector(state=>state.user.disabled)
  const updateTokens=async()=>{
    try {
      await userDAO.updateUserBalance();
      dispatch(setDisabled(false));
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <>
    <div className='text-center h1 m-4 pt-3'>Welcome, Mr. Owner &#129332;</div>
    <div className='text-center h5'>Public Address: {selectedAddress}</div>
    <div className='text-center h5 mb-3'>Availaible Tokens: {parseInt(balance._hex,16)}</div>
    {disabled &&<div className='text-center mb-3'><button onClick={updateTokens} className='btn text-center btn-success '>Update Tokens (Before Posting/Voting)</button></div>}
    <div className='row my-4'>
        <div className='col-6'>
        <AddMember addMember={userDAO.addMember}/>
        </div>
        <div className='col-6'>
        <RemoveMember removeMember={userDAO.removeMember}/>
        </div>
        
    </div>
    <div className='row'>
    <JoinRequests/>
    </div>
    <div className='row'>
      <ProposeForm proposeMessage={userDAO.proposeMessage}/>
      {/* <Proposals userDAO={userDAO} /> */}
    </div>
    <div className='row'>
      <AcceptedProporsals/>
    </div>
    <div className='row'>
      <Proposals />
    </div>
    </>
  )
}

export default Owner