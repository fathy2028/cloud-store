import React, { useState, useEffect } from 'react';
import Mylayout from '../../components/Layout/Mylayout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [auth, setAuth] = useAuth();
  const backendUrl = process.env.BACKEND_URL || "https://cloud-pharmacy-api.vercel.app"

  useEffect(() => {
    const { name, email, phone, address } = auth?.user;
    setName(name);
    setEmail(email);
    setPhone(phone);
    setAddress(address);
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${backendUrl}/api/v1/auth/updateuserprofile`, {
        name,
        email,
        password,
        phone,
        address,
        answer
      });

      if (data?.success) {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <Mylayout title={"Dashboard - Profile"}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <div className='register'>
              <h2>Update Your Profile Now</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="form-control" 
                    placeholder='Enter Your Name' 
                  />
                </div>
                <div className="mb-3">
                  <input 
                    type="email" 
                    disabled 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="form-control" 
                    placeholder='Enter Your Email' 
                  />
                </div>
                <div className="mb-3">
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="form-control" 
                    placeholder='Enter Your Password' 
                  />
                </div>
                <div className="mb-3">
                  <input 
                    type="text" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="form-control" 
                    placeholder='Enter Your Phone Number' 
                  />
                </div>
                <div className="mb-3">
                  <input 
                    type="text" 
                    required 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="form-control" 
                    placeholder='Enter Your Address' 
                  />
                </div>
                <div className="mb-3">
                  <input 
                    type="text" 
                    value={answer} 
                    onChange={(e) => setAnswer(e.target.value)} 
                    className="form-control" 
                    placeholder='What is your best friend name (for account recovery)?' 
                  />
                </div>
                <button type="submit" className="btn btn-dark">Update</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Mylayout>
  );
}

export default Profile;
