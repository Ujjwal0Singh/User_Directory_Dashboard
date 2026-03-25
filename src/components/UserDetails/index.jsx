import { useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import './index.css'

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load user details');
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading-spinner">Loading user details...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="detail-container">
        <div className="error-message">{error || 'User not found'}</div>
        <button onClick={() => navigate('/')} className="back-button">← Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <button onClick={() => navigate('/')} className="back-button">← Back to Dashboard</button>
      <div className="user-card">
        <div className="card-header">
          <h2>{user.name}</h2>
          <p className="username">@{user.username}</p>
        </div>
        <div className="info-section">
          <h3>Contact Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{user.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Website:</span>
              <span className="info-value">
                <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">{user.website}</a>
              </span>
            </div>
            </div>
          <div className="info-section">
            <h3>Address</h3>
            <div className="info-grid">
              <div className="info-item">
                  <span className="info-label">Street:</span>
                  <span className="info-value">{user.address.street}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Suite:</span>
                  <span className="info-value">{user.address.suite}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">City:</span>
                  <span className="info-value">{user.address.city}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Zipcode:</span>
                  <span className="info-value">{user.address.zipcode}</span>
                </div>
                <div className="info-item geo-item">
                  <span className="info-label">Geo (lat/lng):</span>
                  <span className="info-value">{user.address.geo.lat} / {user.address.geo.lng}</span>
                </div>
              </div>
            </div>
            <div className="info-section">
              <h3>Company</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{user.company.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Catch Phrase:</span>
                  <span className="info-value">"{user.company.catchPhrase}"</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Business:</span>
                  <span className="info-value">{user.company.bs}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
};

export default UserDetail;