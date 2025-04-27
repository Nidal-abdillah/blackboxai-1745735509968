import React, { useState, useEffect } from 'react';

function App() {
  const [cvs, setCvs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cvFile: null,
  });
  const [message, setMessage] = useState('');

  const backendUrl = 'http://192.168.7.91:3001';

  useEffect(() => {
    fetch(`${backendUrl}/api/cvs`)
      .then(res => res.json())
      .then(data => setCvs(data))
      .catch(err => console.error('Error fetching CVs:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      cvFile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.cvFile) {
      setMessage('Please fill all fields and select a CV file.');
      return;
    }
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('cvFile', formData.cvFile);

    try {
      const response = await fetch(`${backendUrl}/api/cvs`, {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        const newCv = await response.json();
        setCvs(prev => [...prev, newCv]);
        setMessage('CV submitted successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          cvFile: null,
        });
        document.getElementById('cvFileInput').value = '';
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setMessage('Error submitting CV.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this CV?')) return;
    try {
      const response = await fetch(`${backendUrl}/api/cvs/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCvs(prev => prev.filter(cv => cv.id !== id));
        setMessage('CV deleted successfully.');
      } else {
        setMessage('Failed to delete CV.');
      }
    } catch (error) {
      setMessage('Error deleting CV.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">CV Submission</h1>
        {message && <div className="mb-4 text-center text-red-600">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="cvFile">CV File</label>
            <input
              type="file"
              id="cvFileInput"
              name="cvFile"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit CV
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6 mt-10">
        <h2 className="text-xl font-bold mb-4">Submitted CVs</h2>
        {cvs.length === 0 ? (
          <p>No CVs submitted yet.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-3 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Phone</th>
                <th className="border border-gray-300 px-3 py-2 text-left">CV File</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cvs.map(cv => (
                <tr key={cv.id}>
                  <td className="border border-gray-300 px-3 py-2">{cv.name}</td>
                  <td className="border border-gray-300 px-3 py-2">{cv.email}</td>
                  <td className="border border-gray-300 px-3 py-2">{cv.phone}</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <a
                      href={`http://192.168.7.91:3001/uploads/${cv.cvFileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {cv.originalFileName}
                    </a>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <button
                      onClick={() => handleDelete(cv.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
