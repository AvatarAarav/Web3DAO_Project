import React, { useState, useEffect } from 'react';
import { Container, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setJoinedProporsals } from './store/userSlice';

const JoinRequests = () => {
    const  userDAO = useSelector(state=>state.user.dao)
    const dispatch=useDispatch()
    const messages = useSelector(state=>state.user.joinProporsals)
    const fetchMessages = async () => {
        const requestCount = await userDAO.joinRequestCount();
        const tempArray = []
        for (var i = requestCount - 1; i >= 0; i--) {
            const tempAddress=await userDAO.joinRequests(i)
            const tempProp = await userDAO.joinRequestString(tempAddress);

            tempArray.push({proposer:tempAddress,message:tempProp})
        }
        dispatch(setJoinedProporsals(tempArray))
    };
    useEffect(() => {
        fetchMessages();
    }, []);

    const handleRefresh = () => {
        fetchMessages()
    };

    return (
        <Container>
            <div className='d-flex justify-content-between'>
                <h1 className="text-center">JOIN REQUESTS</h1>
                <Button variant="secondary" className="refresh-button " onClick={handleRefresh}>
                    Refresh
                </Button>
            </div>
            <div style={{ height: '250px', overflowY: 'auto' }}>
                <ListGroup>
                    {messages.map((message) => (
                        <ListGroupItem as="li" className='my-3  align-items-start' key={message.proposer}>

                            <div>

                                <strong>Proposer:</strong> {message.proposer}
                            </div>
                            <br />
                            <div>
                                <strong>Message:</strong> {message.message}
                            </div>


                        </ListGroupItem>
                    ))}
                </ListGroup>
            </div>
        </Container>
    );
};

export default JoinRequests;
