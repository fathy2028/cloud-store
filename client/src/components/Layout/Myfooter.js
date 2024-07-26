import React from 'react'
import {Link} from "react-router-dom"
const Myfooter = () => {
  return (
    <div className='footer'>
   <h4 className='text-center'>
    All Rights Reserved! &copy; Eng/ Fathy Nassef
   </h4> 
   <p className='text-center mt-3'>
   <Link to="/contactus">Contact Us</Link> | <Link to="/aboutus">About Us</Link> |  <Link to="/policy">Privacy Policy</Link>
   </p>
    </div>
  )
}

export default Myfooter