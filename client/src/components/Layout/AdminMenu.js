import React from 'react'
import Mylayout from './Mylayout';
import { NavLink } from 'react-router-dom';
const AdminMenu = () => {
  return (
    <>
<div className='text-ceter'>
<div class="list-group">
<h1 className='bg-black text-light'>Admin Panel</h1>
  <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action">Create Category</NavLink>
  <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">Create Product</NavLink>
  <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">Products</NavLink>
  <NavLink to="/dashboard/admin/allusers" className="list-group-item list-group-item-action">Users</NavLink>
  <NavLink to="/dashboard/admin/adminprofile" className="list-group-item list-group-item-action">Profile</NavLink>
  <NavLink to="/dashboard/admin/allorders" className="list-group-item list-group-item-action">Orders</NavLink>
</div>
</div>
    </>
  )
}

export default AdminMenu