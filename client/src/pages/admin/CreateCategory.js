import React, { useEffect, useState } from 'react';
import Mylayout from '../../components/Layout/Mylayout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import CategoryForm from '../../components/Form/CategoryForm';
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedname, setUpdatedName] = useState("");
  const backendUrl = process.env.BACKEND_URL || "https://cloud-pharmacy-api.vercel.app";

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/v1/category/create-category`, { name });
      if (data?.success) {
        toast.success(`${name} is created`);
        getallCategories();
        setName("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in submitting the category");
    }
  };

  const handleupdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${backendUrl}/api/v1/category/update-category/${selected._id}`, { name: updatedname });
      if (data.success) {
        toast.success(`Category name is now ${updatedname}`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getallCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handledelete = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/v1/category/deletecategory/${id}`);
      if (data.success) {
        toast.success(`Deleted successfully`);
        setSelected(null);
        getallCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const getallCategories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/category/getcategories`);
      if (data?.success) {
        setCategories(data?.categories);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching categories");
    }
  };

  useEffect(() => {
    getallCategories();
  }, []);

  return (
    <Mylayout title={"Dashboard - Create Category"}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Category Management</h1>
            <div className='p-3 w-50'>
              <CategoryForm handlesubmit={handlesubmit} value={name} setValue={setName} />
            </div>
            <div className='w-75'>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map(c => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button onClick={() => { setVisible(true); setUpdatedName(c.name); setSelected(c); }} className='btn btn-primary ms-2'>Edit</button>
                        <button onClick={() => handledelete(c._id)} className='btn btn-danger ms-2'>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal onCancel={() => setVisible(false)} footer={null} visible={visible}>
              <CategoryForm value={updatedname} setValue={setUpdatedName} handlesubmit={handleupdate} />
            </Modal>
          </div>
        </div>
      </div>
    </Mylayout>
  );
};

export default CreateCategory;
