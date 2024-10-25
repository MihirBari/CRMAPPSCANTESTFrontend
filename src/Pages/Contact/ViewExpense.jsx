import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SideNavBar from '../Sidebar/Navbar';
import ExpenseDetails from './ExpenseDetails';
import axios from 'axios';
import API_BASE_URL from "../../config";

const ViewExpense = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axios.get(`${API_BASE_URL}/api/Contact/showOneContact/${id}`)
        .then(response => {
          console.log('API Response:', response.data);
          setProduct(response.data);
        })
        .catch(error => {
          console.error('Error fetching product data:', error);
        });
    };
  
    fetchData();
  }, [id]);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <SideNavBar />
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-center">Expense</h1>
          </div>

          {product && <ExpenseDetails product={product} />}
        </div>
      </div>
    </>
  );
};

export default ViewExpense;


