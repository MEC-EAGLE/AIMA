import { useState } from 'react';

function CreateOpportunity() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Opportunity posted!');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2>Create Opportunity</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Post</button>
      </form>
    </div>
  );
}

export default CreateOpportunity;
