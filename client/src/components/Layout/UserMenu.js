import React from 'react'
import { NavLink } from 'react-router-dom';
const UserMenu = () => {
  return (
    <>
<div className='text-ceter'>
<div class="list-group">
<h1 className='bg-black text-light'>User Panel</h1>
  <NavLink to="/dashboard/user/profile" className="list-group-item list-group-item-action">Profile</NavLink>
  <NavLink to="/dashboard/user/orders" className="list-group-item list-group-item-action">Orders</NavLink>
</div>
</div>
    </>
  )
}

export default UserMenu