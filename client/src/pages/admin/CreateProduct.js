import React, { useEffect, useState } from 'react';
import Mylayout from '../../components/Layout/Mylayout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Select } from 'antd';

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const backendUrl = process.env.BACKEND_URL || "https://cloud-pharmacy-api.vercel.app";

  // Fetch all categories
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("shipping", shipping);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/v1/product/create-product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (data?.success) {
        toast.success("Product created successfully");
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setQuantity("");
        setShipping(false);
        setPhoto(null);
        setPhotoPreview(null);
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating product");
    }
  };

  return (
    <Mylayout title={"Dashboard - Create Product"}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Product Management</h1>
            <form className='m-1 w-75' onSubmit={handleCreateProduct}>
              <Select
                onChange={(value) => setCategory(value)}
                bordered={false}
                placeholder="Select Category"
                size='large'
                showSearch
                className='form-select mb-3'
              >
                {categories?.map(c => (
                  <Option key={c._id} value={c._id}>{c.name}</Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Shipping</label>
                <Select
                  onChange={(value) => setShipping(value)}
                  bordered={false}
                  placeholder="Select Shipping"
                  size='large'
                  showSearch
                  className='form-select mb-3'
                >
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </div>
              <div className="mb-3">
                <label className="form-label">Photo</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handlePhotoChange}
                />
                {photoPreview && (
                  <div className="mt-3">
                    <img src={photoPreview} alt="Selected" width="100" height="100" />
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary">Create Product</button>
            </form>
          </div>
        </div>
      </div>
    </Mylayout>
  );
};

export default CreateProduct;
