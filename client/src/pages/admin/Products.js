import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Popconfirm, message, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';
import Mylayout from '../../components/Layout/Mylayout';
import AdminMenu from '../../components/Layout/AdminMenu';

const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  const backendUrl = process.env.BACKEND_URL || "https://cloud-store-api-ruby.vercel.app"

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/product/getall-products`);
      if (data?.success) {
        setProducts(data?.products);
      } else {
        message.error("Failed to fetch products");
      }
    } catch (error) {
      console.log(error);
      message.error("Error while fetching products");
    }
  };

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/category/getcategories`);
      if (data?.success) {
        setCategories(data?.categories);
      } else {
        message.error("Failed to fetch categories");
      }
    } catch (error) {
      console.log(error);
      message.error("Error while fetching categories");
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/v1/product/delete-product/${productId}`);
      if (data?.success) {
        message.success("Product deleted successfully");
        getAllProducts(); // Refresh the product list after deletion
      } else {
        message.error("Failed to delete product");
      }
    } catch (error) {
      console.log(error);
      message.error("Error while deleting product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      category: product.category._id,
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    if (file) {
      formData.append("photo", file);
    }

    try {
      const { data } = await axios.put(`${backendUrl}/api/v1/product/update-product/${editingProduct._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data?.success) {
        message.success("Product updated successfully");
        window.location.reload()
        getAllProducts();
        setIsModalVisible(false);
        setEditingProduct(null);
        form.resetFields();
        setFile(null); // Reset file after update
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
      } else {
        message.error("Failed to update product");
      }
    } catch (error) {
      console.log(error);
      message.error("Error while updating product");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSearch = async (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    if (keyword === "") {
      getAllProducts(); // If the search input is empty, fetch all products
    } else {
      try {
        const { data } = await axios.get(`${backendUrl}/api/v1/product/search/${keyword}`);
        setProducts(data);
      } catch (error) {
        console.log(error);
        message.error("Error while searching products");
      }
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category.name,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Shipping',
      dataIndex: 'shipping',
      key: 'shipping',
      render: (shipping) => (shipping ? 'Yes' : 'No'),
    },
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      render: (photo, record) => (
        <img
          src={`${backendUrl}/api/v1/product/get-product-photo/${record._id}`}
          alt={record.name}
          width="50"
          height="50"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)} style={{ marginRight: 10 }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => deleteProduct(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Mylayout title="Dashboard - All Products">
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>All Products</h1>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ marginBottom: '20px' }}
            />
            <Table dataSource={products} columns={columns} rowKey="_id" />
          </div>
        </div>
      </div>
      <Modal
        title="Edit Product"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProduct(null);
          form.resetFields();
          setFile(null); // Reset file on cancel
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input on cancel
          }
        }}
        footer={null}
      >
        {editingProduct && (
          <Form
            form={form}
            onFinish={handleUpdate}
            initialValues={{
              name: editingProduct.name,
              description: editingProduct.description,
              price: editingProduct.price,
              category: editingProduct.category._id,
              quantity: editingProduct.quantity,
              shipping: editingProduct.shipping,
            }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter the product name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter the product description' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter the product price' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select>
                {categories.map(category => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: 'Please enter the product quantity' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="shipping"
              label="Shipping"
              rules={[{ required: true, message: 'Please select shipping option' }]}
            >
              <Select>
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Photo"
            >
              <input type="file" onChange={handleFileChange} ref={fileInputRef} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Mylayout>
  );
};

export default Products;
