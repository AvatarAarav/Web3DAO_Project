import React, { useState, useEffect } from 'react';
import { Container, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setJoinedProporsals } from './store/userSlice';

const JoinRequests = () => {
    const disabled=useSelector(state=>state.user.disabled)
    const userDAO = useSelector(state => state.user.dao)
    const dispatch = useDispatch()
    const messages = useSelector(state => state.user.joinProporsals)
    const fetchMessages = async () => {
        const jointRequestCount = await userDAO.joinRequestCount();
        const tempArray = []
        for (var i = jointRequestCount - 1; i >= 0; i--) {
            let tempProp=await userDAO.joinRequests(i);
            if(!tempProp.member){
                const prize=await userDAO.joinVotePrize(i)
                tempProp={prize,...tempProp}
                tempArray.push(tempProp)
            }
        }
        dispatch(setJoinedProporsals(tempArray))
    };
    useEffect(() => {
        fetchMessages();
    }, []);

    const handleRefresh = () => {
        fetchMessages()
    };
    
    const handleVote = async (messageId) => {
        try {
          const event=await userDAO.voteJoinRequests(messageId);
        } catch (error) {
          console.error(error)
        }
      };

    return (
        <Container className='px-5 mt-5'>
            <div className='d-flex justify-content-between'>
                <h1 className="text-center">Join Requests</h1>
                <Button variant="secondary" className="refresh-button " onClick={handleRefresh}>
                    Refresh
                </Button>
            </div>
            <div style={{ height: '300px', overflowY: 'auto' }}>
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
                                    <strong>Candidate:</strong> {message.candidate}
                                </div>
                            </div>
                            <div>
                                <div>
                                    <strong>Vote_Count:</strong>{parseInt(message.voteCount._hex, 16)}
                                </div>
                                <Button variant="primary" disabled={disabled} onClick={() => handleVote(message.id)}>
                                    Vote
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

export default JoinRequests;
