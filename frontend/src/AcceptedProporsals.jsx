import React, { useState, useEffect } from 'react';
import { useSelector ,useDispatch} from 'react-redux';
import { Container, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { setAcceptedProporsals } from './store/userSlice';

const AcceptedProporsals = () => {
    const dispatch=useDispatch()
    const  userDAO = useSelector(state=>state.user.dao)
    const messages = useSelector(state=>state.user.acceptedProporsals)
    const fetchMessages = async () => {
        const proposalCount = await userDAO.acceptedProporsalsIdsCount();
        const tempArray = []
        for (var i = proposalCount - 1; i >= 0; i--) {
            const tempPropId = await userDAO.acceptedProporsalsIds(i);
            const tempProp = await userDAO.proposals(tempPropId);
            tempArray.push(tempProp)
        }
        dispatch(setAcceptedProporsals(tempArray))
    };
    useEffect(() => {
        fetchMessages();
    }, []);

    const handleRefresh = () => {
        fetchMessages()
    };
    return (
        <Container className='px-5 mt-5'>
            <div className='d-flex justify-content-between'>
                <h1 className="text-center">Accepted Proporsals List</h1>
                <Button variant="secondary" className="refresh-button " onClick={handleRefresh}>
                    Refresh
                </Button>
            </div>
            <div style={{ height: '300px', overflowY: 'auto' }}>
                <ListGroup>
                    {messages.map((message) => (
                        <ListGroupItem as="li" className='my-3  align-items-start' key={parseInt(message.id._hex, 16)}>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <strong>Message ID:</strong> {parseInt(message.id._hex, 16)}
                                </div>
                                <div>

                                    <strong>Proposer:</strong> {message.proposer}
                                </div>
                            </div>
                            <br/>
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

export default AcceptedProporsals;
