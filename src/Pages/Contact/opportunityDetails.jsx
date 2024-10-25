import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import { Loader } from "../loader";

const OpportunityDetails = ({customer_entity}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aggregates, setAggregates] = useState({});
  

  const calculateAggregates = (data) => {
    const totalEntity = new Set(data.map((user) => user.customer_entity)).size;
    const totalLicenseType = new Set(data.map((user) => user.License_type)).size;
    const totalType = new Set(data.map((user) => user.type)).size;
    const totalValue = data.reduce((acc, user) => acc + user.value, 0);

    return {
      TotalEntity: totalEntity,
      TotalLicenseType: totalLicenseType,
      TotalType: totalType,
      TotalValue: totalValue,
    };
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    if (formattedDate.getTime() === new Date("1970-01-01T00:00:00Z").getTime()) {
      return "";
    }
    return formattedDate.toLocaleString("en-Uk", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "IST",
    });
  };
  
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Contact/showCustomerOpportunity/${customer_entity}`,
         
        );
        setUsers(response.data.products);
        const initialAggregates = calculateAggregates(response.data.products);
        setAggregates(initialAggregates);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const formatIndianNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };


  return (
    <>
<div className="h-screen flex-1 p-7">
  <div>
    <h1 className="text-2xl font-semibold text-center">Summary</h1>
  </div>
  

  <div>
    {loading ? (
      <Loader />
    ) : users.length === 0 ? (
      <div className="text-xl font text-center">Please add details.</div>
    ) : (
      <div>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table className="table-auto" style={{ width: "100%" }}>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th className="border px-4 py-2">Opportunity Type</th>
                <th className="border px-4 py-2">License Type</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">FROM</th>
                <th className="border px-4 py-2">TO</th>
                <th className="border px-4 py-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) &&
                users.map((user) => (
                  <tr style={{ textAlign: "center" }} key={user.id}>
                    <td className="border px-4 py-2">{user.type}</td>
                    <td className="border px-4 py-2">{user.License_type}</td>
                    <td className="border px-4 py-2">{user.status}</td>
                    <td className="border px-4 py-2">{formatDate(user.license_from)}</td>
                    <td className="border px-4 py-2">{formatDate(user.license_to)}</td>
                    <td className="border px-4 py-2">{formatIndianNumber(user.value)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table className="table-auto" style={{ width: "100%" }}>
            <tbody>
              <tr style={{ textAlign: "center" }}>
                <th className="px-4 py-2">Total Type</th>
                <th className="px-4 py-2">Total License Type</th>
                <th className="px-4 py-2">Total Value</th>
              </tr>
              <tr style={{ textAlign: "center" }}>
                <td className="border px-4 py-2">{aggregates.TotalType}</td>
                <td className="border px-4 py-2">{aggregates.TotalLicenseType}</td>
                <td className="border px-4 py-2">{formatIndianNumber(aggregates.TotalValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
</div>


 </>
  );  
};

export default OpportunityDetails;
