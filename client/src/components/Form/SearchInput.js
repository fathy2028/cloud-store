import React from 'react';
import { useSearch } from '../../context/search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const backendUrl = process.env.BACKEND_URL || "https://cloud-store-api-gamma.vercel.app"

    const fetchAllProducts = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/v1/product/getall-products`);
            setValues({ ...values, results: data.products });
        } catch (error) {
            console.log(error);
        }
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        if (values.keyword.trim() === "") {
            await fetchAllProducts();
            navigate("/search");
        } else {
            try {
                const { data } = await axios.get(`${backendUrl}/api/v1/product/search/${values.keyword}`);
                setValues({ ...values, results: data });
                navigate("/search");
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleInputChange = (e) => {
        const keyword = e.target.value;
        setValues({ ...values, keyword });
    };

    return (
        <div style={{ paddingRight: "50px" }}>
            <form className="d-flex" role="search" onSubmit={handlesubmit}>
                <input 
                    type="search" 
                    placeholder="Search"
                    value={values.keyword} 
                    onChange={handleInputChange}
                    aria-label="Search"
                    style={{
                        width: '400px', 
                        padding: '0.25rem 0.5rem', 
                        fontSize: '0.875rem', 
                        borderRadius: '0.2rem', 
                        border: '1px solid #ced4da'
                    }} 
                />
                <button 
                    type="submit" 
                    className="btn btn-sm" 
                    style={{ 
                        marginLeft: '0.5rem',
                        backgroundColor: 'black',
                        color: 'white',
                        border: '1px solid black' 
                    }}
                >
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchInput;
