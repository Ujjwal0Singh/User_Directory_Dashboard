import { useNavigate } from 'react-router-dom';
import './index.css'
import { useState, useEffect, useMemo } from 'react';

const Dashboard = () => {
      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');
      const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

      const fetchUsers = async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await res.json();
        return data;
      };
      const navigate = useNavigate();

      useEffect(() => {
        fetchUsers()
          .then(data => {
            setUsers(data);
            setLoading(false);
          })
          .catch(err => {
            setError('Failed to load users. Please try again.', err);
            setLoading(false);
          });
      }, []);
      const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        const lowerTerm = searchTerm.toLowerCase();
        return users.filter(user => 
          user.name.toLowerCase().includes(lowerTerm) || 
          user.email.toLowerCase().includes(lowerTerm)
        );
      }, [users, searchTerm]);

      const sortedUsers = useMemo(() => {
        let sortableUsers = [...filteredUsers];
        if (sortConfig.key) {
          sortableUsers.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];
            if (sortConfig.key === 'company') {
              aValue = a.company.name;
              bValue = b.company.name;
            }
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
          });
        }
        return sortableUsers;
      }, [filteredUsers, sortConfig]);

      const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
        }
        setSortConfig({ key, direction });
      };

      const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return '↕️';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
      };

      const handleRowClick = (userId) => {
        navigate(`/user/${userId}`);
      };

      if (loading) {
        return (
          <div className="dashboard-container">
            <div className="loading-spinner">Loading users...</div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="dashboard-container">
            <div className="error-message">{error}</div>
          </div>
        );
      }

      return (
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1>User Directory Dashboard</h1>
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </header>
          
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('name')} className="sortable-header">
                    Name <span className="sort-icon">{getSortIndicator('name')}</span>
                  </th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th onClick={() => requestSort('company')} className="sortable-header">
                    Company <span className="sort-icon">{getSortIndicator('company')}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-results">No users found</td>
                  </tr>
                ) : (
                  sortedUsers.map(user => (
                    <tr key={user.id} onClick={() => handleRowClick(user.id)} className="user-row">
                      <td className="user-name">{user.name}</td>
                      <td className="user-email">{user.email}</td>
                      <td className="user-phone">{user.phone}</td>
                      <td className="user-company">{user.company.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="user-count">
            Showing {sortedUsers.length} of {users.length} users
          </div>
        </div>
      );
    };
export default Dashboard;