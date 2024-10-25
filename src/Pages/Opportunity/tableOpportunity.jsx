import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import "./orders.css";
import DataTable, { createTheme } from "react-data-table-component";
import API_BASE_URL from "../../config";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {  CiFilter } from "react-icons/ci";
import FilterModal from "./FilterModal";
import ExportTable from "./ExportTable";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog.jsx";
import { PiExportBold } from "react-icons/pi";

const TableOpportunity = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const tableRef = useRef(null); 
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [filters, setFilters] = useState({
    customerEntities: "",
    type: "",
    LicenseType: "",
    value: "",
    closureTime: "",
    status: "",
    period: "",
    licenseFrom: "",
    licenseTo: "",
  });

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  const handleDeleteClick = (itemId) => {
    setDeleteItemId(itemId); // Set the itemId to be deleted
    setShowDeleteConfirmation(true); // Show the delete confirmation dialog
  };

  const handleDeleteConfirmation = (itemId) => {
    console.log("Deleting order with ID:", itemId);

    axios({
      method: "delete",
      url: `${API_BASE_URL}/api/Opportunity/deleteOpportunity`,
      data: { id: itemId }, // Include only the ID in the request payload
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Delete successful. Deleted order_id:", itemId);
        window.location.reload();
        toast.success("Deleted Successfully");
      })
      .catch((error) => {
        console.error("Error deleting:", error);
        toast.error("Error deleting order");
      });
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteItemId(null);
    setShowDeleteConfirmation(false);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const controller = new AbortController();
      const signal = controller.signal;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Opportunity/showOpportunity`,
          {
            params: filters, 
            signal: signal, 
          }
        );
        setUsers(response.data.products);
        setFilteredUsers(response.data.products);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          console.error("Error fetching orders:", err);
        }
      }
      return () => {
        controller.abort(); 
      };
    };

    fetchOrders();
  }, [filters]);

  const handleEditClick = (id) => {
    navigate(`edit/${id}`);
  };

  const handleViewClick = (id) => {
    //console.log("Viewing order with ID:", id);
    navigate(`view/${id}`);
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    if (
      formattedDate.getTime() === new Date("1970-01-01T00:00:00Z").getTime()
    ) {
      return "";
    }
    return formattedDate.toLocaleString("en-Uk", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "IST",
    });
  };

  const formatIndianNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => (
        <span
          className="view-link"
          onClick={() => handleViewClick(row.id)}
          style={{
            cursor: "pointer",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {row.id}
        </span>
      ),
      width: "100px",
    },
    {
      name: "Customer Entity",

      sortable: true,
      cell: (row) => (
        <span
          className="view-link"
          onClick={() => handleViewClick(row.id)}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {row.customer_entity}
        </span>
      ),
    },
    {
      name: "Opportunity Type",
      selector: (row) => row.type,
      sortable: true,
      width: "150px",
    },
    {
      name: "License Type",
      selector: (row) => row.License_type,
      sortable: true,
      width: "150px",
    },
    {
      name: "Value",
      selector: (row) => formatIndianNumber(row.value),
      sortable: true,
      width: "150px",
    },
    {
      name: "Opportunity Status",
      selector: (row) => row.status,
      sortable: true,
      width: "150px",
    },
    {
      name: "From",
      selector: (row) => formatDate(row.license_from),
      sortable: true,
      width: "150px",
    },
    {
      name: "To",
      selector: (row) => formatDate(row.license_to),
      sortable: true,
      width: "150px",
    },
    {
      name: "Edit",
      cell: (row) => (
        <MdEdit onClick={() => handleEditClick(row.id)}>Edit</MdEdit>
      ),
      button: true,
    },
    {
      name: "Delete",
      cell: (row) => (
        <MdDelete onClick={() => handleDeleteClick(row.id)}>Delete</MdDelete>
      ),
      button: true,
    },
  ];

  const CustomHeader = ({ column }) => (
    <div title={column.name} style={{ whiteSpace: "normal" }}>
      {column.name}
    </div>
  );

  const modifiedColumns = columns.map((col) => ({
    ...col,
    header: <CustomHeader column={col} />,
  }));

  createTheme(
    "solarized",
    {
      text: {
        primary: "#FFFFFF",
        secondary: "#FFFFFF",
      },
      background: {
        default: "rgba(59,139,246,1)",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#073642",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(59,139,246,1)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "light"
  );

  const customStyles = {
    headCells: {
      style: {
        color: "rgb(255 255 255)",
        zIndex: "auto",
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
        },
      },
    },
    header: {
      style: {
        minHeight: "56px",
        fontSize: "25px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
        },
        fontSize: "16px",
      },
    },
  };

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData); // Set filteredTotalData
    setFilterModalIsOpen(false);
  };

  const initialFilters = {
    customerEntities: "",
    type: "",
    LicenseType: "",
    value: "",
    closureTime: "",
    status: "",
    licenseFrom: "",
    licenseTo: "",
  };

  const handleExportClick = () => {
    setExportModalIsOpen(true);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = users.filter(
      (user) =>
        user.customer_entity &&
        user.customer_entity.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filteredData);
  };


  const customPaginationComponentOptions = {
    rowsPerPageText: "Rows Per Page :",
    rangeSeparatorText: "of",
    noRowsPerPage: false,
    selectAllRowsItem: false,
  };

  // Scroll to top when the page changes
  const handlePageChange = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={tableRef} className="order">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search"
          onChange={handleSearch}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <PiExportBold
          size={40}
          style={{ marginLeft: "25px" }}
          onClick={handleExportClick}
        />
        <ExportTable
          data={filteredUsers}
          isOpen={exportModalIsOpen}
          onRequestClose={() => setExportModalIsOpen(false)}
        />
        <CiFilter
          size={40}
          style={{ marginLeft: "25px" }}
          onClick={handleCiFilterClick}
        />
      </div>
      <FilterModal
        isOpen={filterModalIsOpen}
        onClose={() => setFilterModalIsOpen(false)}
        onApplyFilters={onApplyFilters}
        resetFilters={() => setFilters(initialFilters)}
      />
      <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={handleCloseDeleteConfirmation}
        onDelete={() => {
          handleDeleteConfirmation(deleteItemId);
          handleCloseDeleteConfirmation();
        }}
      />
      <DataTable
        className="dataTable"
        columns={modifiedColumns}
        data={filteredUsers}
        customStyles={customStyles}
        fixedHeader
        fixedHeaderScrollHeight="350px"
        striped
        theme="solarized"
        pagination
        highlightOnHover
        paginationPerPage={20}
        paginationRowsPerPageOptions={[20, 40, 60]}
        paginationComponentOptions={customPaginationComponentOptions}
        onChangePage={handlePageChange}
      />
    </div>
  );
};

export default TableOpportunity;