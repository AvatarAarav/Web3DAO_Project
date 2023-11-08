import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Proposals from './Proposals'
import AcceptedProporsals from './AcceptedProporsals'
import ProposeForm from './ProposeForm'
import { setDisabled } from './store/userSlice'
function Member() {
  const dispatch=useDispatch()
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
    <div className='text-center h1 m-4 pt-3'>Welcome, Silly Member &#128104; / &#128105;</div>
    <div className='text-center h5'>Public Address: {selectedAddress}</div>
    <div className='text-center h5 mb-3'>Availaible Tokens:  {parseInt(balance._hex,16)}</div>
    {disabled &&<div className='text-center mb-3'><button onClick={updateTokens} className='btn text-center btn-success '>Update Tokens (Before Posting/Voting)</button></div>}
    <div className='row'>
      <ProposeForm proposeMessage={userDAO.proposeMessage}/>

    </div>
    <div className='row'>
      <AcceptedProporsals/>
    </div>
    <div className='row'>
      <Proposals userDAO={userDAO} selectedAddress={selectedAddress}/>
    </div>
    </>
  )
}

export default Member