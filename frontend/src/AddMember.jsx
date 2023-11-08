import React, { useState } from 'react';

const AddMember = ({addMember}) => {
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Adding")
    await addMember(address)
    console.log("Added")
    console.log('Submitted Address:', address);
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2>Add Member</h2>
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
            <button type="submit" className="btn btn-primary">
              Add Member
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
