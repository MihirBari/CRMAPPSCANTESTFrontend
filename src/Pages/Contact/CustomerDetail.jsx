import React, { useState, useEffect, useContext } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import AddContact from "./AddContact";
import axios from "axios";
import API_BASE_URL from "../../config";
import { toast } from "react-toastify";
import DeleteConfirmationDialog from "../Contact/DeleteConfirmationDialog";
import { Link, useParams } from "react-router-dom";
import EditContact from "./editContact";
import FilterModal from "./filterModalContact";
import { CiFilter } from "react-icons/ci";
import { IoMdAddCircle } from "react-icons/io";
import OpportunityDetails from "./opportunityDetails";
import { AuthContext } from "../../context/AuthContext";

const CustomerDetail = () => {
  const [addContactIsOpen, setAddContactIsOpen] = useState(false);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    designation: "",
    name: "",
  });

  const { customer_entity } = useParams();

  const handleAddClick = () => {
    setAddContactIsOpen(true);
  };

  const handleEditClick = (customerId) => {
    setEdit(true);
    setCustomerId(customerId); // Assuming you have a state to store the customer ID
  };

  const handleDeleteConfirmation = (itemId) => {
    axios
      .delete(`${API_BASE_URL}/api/Contact/deleteContact`, {
        data: { id: itemId },
      })
      .then((response) => {
        console.log("Delete successful:", response.data);
        toast.success("Deleted Successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting:", error);
      });
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteItemId(null);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setShowDeleteConfirmation(true);
  };

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData);
    setFilterModalIsOpen(false);
  };

  const initialFilters = {
    designation: "",
    name: "",
  };

  const { currentUser } = useContext(AuthContext)

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Contact/showContact/${customer_entity}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`
            }
          }
        );
        setCustomers(response.data.products);
        setFilteredUsers(response.data.products);
        //console.log(response.data.products);
        setLoading(false); // Update loading state
      } catch (error) {
        console.error("Error fetching customer details:", error);
        setLoading(false); // Update loading state even if there's an error
      }
    };

    fetchData();
  }, [customer_entity]);

  return (
    <>
    <div className="h-screen flex-1 p-7">
      <div>
        <h1 className="text-2xl font-semibold text-center">{customer_entity}</h1>
      </div>
      <div style={{ float: "right" }}>
      <IoMdAddCircle 
        size={40}
        onClick={handleAddClick}
        />
        <AddContact
          isOpen={addContactIsOpen}
          onClose={() => setAddContactIsOpen(false)}
          customer_entity={customer_entity}
        />
        <CiFilter
          size={40}
          style={{ marginLeft: "25px" }}
          onClick={handleCiFilterClick}
        />
        <FilterModal
          isOpen={filterModalIsOpen}
          onClose={() => setFilterModalIsOpen(false)}
          onApplyFilters={onApplyFilters}
          filters={filters}
          resetFilters={() => setFilters(initialFilters)}
          customer_entity={customer_entity}
        />
      </div>

      <div>
        {loading ? (
          <div>Loading...</div>
        ) : customers.length === 0 ? (
          <div className="text-xl font text-center">
            No Contacts available, please add details.
          </div>
        ) : (
          Array.isArray(customers) &&
          filteredUsers.map((customer) => (
            <div
              key={customer.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px",
                height: "auto",
                width: "90%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
              }}
            >
              <div>
                <h2>Name </h2>
                <div>{customer.name}</div>
              </div>
              <div>
                <h2>Designation </h2>
                <div>{customer.designation}</div>
              </div>
              <div>
                <h2>Phone </h2>
                <div>{customer.phone}</div>
              </div>
              <div>
                <h2>Email </h2>
                <div>{customer.email}</div>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <MdEdit onClick={() => handleEditClick(customer.id)} />
                {edit && (
                  <EditContact
                    isOpen={edit}
                    onClose={() => setEdit(false)}
                    customerId={customerId}
                  />
                )}
                <MdDelete onClick={() => handleDeleteClick(customer.id)} />
                <DeleteConfirmationDialog
                  isOpen={showDeleteConfirmation}
                  onClose={handleCloseDeleteConfirmation}
                  onDelete={() => {
                    handleDeleteConfirmation(deleteItemId);
                    handleCloseDeleteConfirmation();
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
      <Link to="/Customer">
        <button
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "8px 16px",
            cursor: "pointer",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Back
        </button>
      </Link>
    <div>
      <OpportunityDetails customer_entity={customer_entity} />
    </div>
    </div>
    </>
  );
};

export default CustomerDetail;
