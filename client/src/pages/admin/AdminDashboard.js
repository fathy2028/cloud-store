import React from 'react'
import Mylayout from './../../components/Layout/Mylayout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { useAuth } from '../../context/auth';
const AdminDashboard = () => {
  const [auth]=useAuth()
  return (
    <Mylayout title={"Dashboard - Cloud Store"}>
    <div className='container-fluid m-3 p-3'>
      <div className='row'>
      <div className='col-md-3'>
        <AdminMenu/>
      </div>
      <div className='col-md-9'>
        <div className='card w-75 p-3'>
        <h1>Admin name: {auth?.user?.name}</h1>
        <h1>Admin email: {auth?.user?.email}</h1>
        </div>
      </div>
      </div>
    </div>
    </Mylayout>
  )
}

export default AdminDashboard