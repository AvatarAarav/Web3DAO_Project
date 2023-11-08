import React, { useState, useEffect } from 'react';
import { Container, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useSelector,useDispatch } from 'react-redux';
import { setProporsals } from './store/userSlice';

const Proporsals = () => {
  const disabled=useSelector(state=>state.user.disabled)
  const  userDAO = useSelector(state=>state.user.dao)
  const selectedAddress=useSelector((state)=>state.user.selectedAddress)
  const dispatch=useDispatch()
  const messages=useSelector(state=>state.user.proporsals)
  const fetchMessages = async () => {
    const proposalCount = await userDAO.proposalCount();
    const tempArray = []
    for (var i = proposalCount - 1; i >= 0; i--) {
     
      let tempProp=await userDAO.proposals(i);
      const prize=await userDAO.votePrize(selectedAddress,i)
      tempProp={prize,...tempProp}
      tempArray.push(tempProp)
    }
    dispatch(setProporsals(tempArray))
  };
  useEffect(() => {
    fetchMessages();
  }, []);

  const handleRefresh = () => {
    fetchMessages()
  };

  const handleVote = async (messageId) => {
    try {
      const event=await userDAO.vote(messageId);
      console.log(event)
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <Container className='px-5 mt-5'>
      <div className='d-flex justify-content-between'>
        <h1 className="text-center">Proporsals List</h1>
        <Button variant="secondary" className="refresh-button " onClick={handleRefresh}>
          Refresh
        </Button>
      </div>
      <div style={{ height: '500px', overflowY: 'auto' }}>
        <ListGroup>
          {messages.map((message) => (
            <ListGroupItem as="li" className='my-3 d-flex justify-content-between align-items-start' key={parseInt(message.id._hex, 16)}>
              <div className="ms-2 me-auto" >
                <div>
                  <strong>Message ID:</strong> {parseInt(message.id._hex, 16)}
                </div>
                <div>
                  <strong>Message:</strong> {message.message}
                </div>
                <div>
                  <strong>Proposer:</strong> {message.proposer}
                </div>
              </div>
              <div>
                <div>
                  <strong>Vote_Count:</strong>{parseInt(message.voteCount._hex, 16)}
                </div>
                <Button variant="primary" disabled={message.posted || disabled} onClick={() => handleVote(message.id)}>
                  {message.posted?"Posted":"Vote"}
                </Button>
                <div>
                  <strong>Vote_Prize:</strong>{parseInt(message.prize._hex, 16)}
                </div>
              </div>

            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    </Container>
  );
};

export default Proporsals;
