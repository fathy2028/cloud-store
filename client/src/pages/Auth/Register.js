import React, { useState } from 'react';
import Mylayout from '../../components/Layout/Mylayout';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import "../../styles/authstyle.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.BACKEND_URL || "https://cloud-store-api-ruby.vercel.app"

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/v1/auth/register`, { name, email, password, phone, address, answer });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data && res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <Mylayout title={"Register - Cloud Pharmacy"}>
      <div className='register'>
        <h2>Register Now</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="form-control" 
              id="exampleInputName" 
              placeholder='Enter Your Name'
            />
          </div>
          <div className="mb-3">
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-control" 
              id="exampleInputEmail" 
              placeholder='Enter Your Email'
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="form-control" 
              id="exampleInputPassword1" 
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
              id="exampleInputPhone" 
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
              id="exampleInputAddress" 
              placeholder='Enter Your Address'
            />
          </div>
          <div className="mb-3">
            <input 
              type="text" 
              required 
              value={answer} 
              onChange={(e) => setAnswer(e.target.value)} 
              className="form-control" 
              id="exampleInputAnswer" 
              placeholder="What is your best friend's name? Note that this answer is important to recover the account"
            />
          </div>
          <button type="submit" className="btn btn-dark">Submit</button>
        </form>
      </div>
    </Mylayout>
  );
}

export default Register;
