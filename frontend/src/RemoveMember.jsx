import React, { useState } from 'react';

const RemoveMember = ({removeMember}) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    removeMember(address)
    console.log('Submitted Address:', address);
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2>Remove Member</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Public Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter public address"
                required
              />
            </div>
            <button type="submit" className="btn btn-danger">
              Remove Member
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RemoveMember;
