import React, { useEffect, useState } from 'react';

const JoinForm = ({ userDAO, selectedAddress }) => {
    const [paragraph, setParagraph] = useState('');
    const [button, setButton] = useState('Submit')

    const handleChange = (e) => {
        setParagraph(e.target.value);
    };
    useEffect(() => {
        async function getPrevMess() {
            const message = await userDAO.joinRequestString(selectedAddress);
            if (message !== "") {
                setButton('Edit');
            }
            setParagraph(message);
        }
        getPrevMess()
        
    }, [])
    const handleSubmit = async(e) => {
        e.preventDefault();
        if (paragraph.trim() !== '') {
            await userDAO.addJoinRequest(paragraph);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="paragraphInput">Joining Form </label>
                            <textarea
                                id="paragraphInput"
                                className="form-control"
                                rows="6"
                                placeholder='Tell Me Why you think you are worthy of joining the SILLY DAO??'
                                value={paragraph}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {button}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JoinForm;
