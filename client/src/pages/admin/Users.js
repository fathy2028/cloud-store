import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import Mylayout from '../../components/Layout/Mylayout';
import AdminMenu from '../../components/Layout/AdminMenu';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [auth] = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    answer: ''
  });
  const backendUrl = process.env.BACKEND_URL || "https://cloud-test-api.vercel.app"

  useEffect(() => {
    if (auth?.token) {
      fetchUsers();
    }
  }, [auth?.token]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/auth/users`, {
        headers: {
          Authorization: `${auth.token}`,
        },
      });
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/v1/auth/users/${userId}`, {
        headers: {
          Authorization: `${auth.token}`,
        },
      });
      if (data.success) {
        fetchUsers(); // Refresh the user list
        toast.success('User deleted successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUserDetails({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      password: '',
      answer: ''
    });
  };

  const handleInputChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateUser = async () => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/v1/auth/users/${selectedUser._id}`, userDetails, {
        headers: {
          Authorization: `${auth.token}`,
        },
      });
      if (data.success) {
        toast.success('User updated successfully');
        setSelectedUser(null);
        fetchUsers(); // Refresh the user list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  return (
    <Mylayout title={"Dashboard - All Users"}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>All Users</h1>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by user name"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            {filteredUsers.map((user) => (
              <div key={user._id} className="card mb-2">
                <div className="card-body">
                  <h5 className="card-title">Name: {user.name}</h5>
                  <p className="card-text">Email: {user.email}</p>
                  <p className="card-text">Phone: {user.phone}</p>
                  <p className="card-text">Address: {user.address}</p>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit User
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={userDetails.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={userDetails.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={userDetails.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Answer</label>
                    <input
                      type="text"
                      className="form-control"
                      name="answer"
                      value={userDetails.answer}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateUser}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Mylayout>
  );
};

export default Users;
