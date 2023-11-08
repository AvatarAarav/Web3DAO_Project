import React from 'react'
import JoinForm from './JoinForm'
import { useSelector } from 'react-redux'

function NonMember() {
  const  userDAO = useSelector(state=>state.user.dao)
  const selectedAddress=useSelector((state)=>state.user.selectedAddress)
  return (
    <>
     <div className='text-center h1 m-4 pt-3'>Welcome, Unknown HomoSapien &#128587;</div>
      <div className='text-center h5 mb-5'>Public Address: {selectedAddress}</div>
      <JoinForm userDAO={userDAO} selectedAddress={selectedAddress}/>
    </>
  )
}

export default NonMember