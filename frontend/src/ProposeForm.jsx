import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function ProposeForm({proposeMessage}) {
  const [inputText, setInputText] = useState('');
  const disabled=useSelector(state=>state.user.disabled)

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await proposeMessage(inputText)
    console.log('Input Text:', inputText);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
            <h2>Propose Silly Ideas</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-2">
              <label htmlFor="inputText">The Silly Idea</label>
              <textarea
                rows={6}
                className="form-control"
                id="inputText"
                placeholder="Type only if you are silly enough to type and post...."
                value={inputText}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" disabled={disabled} className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProposeForm;
