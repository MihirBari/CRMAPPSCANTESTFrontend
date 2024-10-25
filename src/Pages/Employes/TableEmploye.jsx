import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./orders.css";
import DataTable, { createTheme } from "react-data-table-component";
import API_BASE_URL from "../../config";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FilterModal from "./FilterModal";
import ExportTable from "./ExportTable";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog.jsx";
import { PiExportBold } from "react-icons/pi";
import { CiFilter } from "react-icons/ci";

const TableEmploye = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    surname: ""
  });

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };
  const handleDeleteClick = (name, surname) => {
    setDeleteItemId({ name, surname });
    setShowDeleteConfirmation(true);
  };
  
  const handleDeleteConfirmation = () => {
    if (!deleteItemId) return;
  
    axios({
      method: "delete",
      url: `${API_BASE_URL}/api/Employes/deleteEmployes`,
      data: { name: deleteItemId.name, surname: deleteItemId.surname },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        window.location.reload();
        toast.success("Deleted Successfully");
      })
      .catch((error) => {
        toast.error("Error deleting employee");
      });
  };
  
  const handleCloseDeleteConfirmation = () => {
    setDeleteItemId(null);
    setShowDeleteConfirmation(false);
  };
  
  useEffect(() => {
    const fetchEmployes = async () => {
      const controller = new AbortController();
      const signal = controller.signal;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Employes/allEmployes`,
          {
            params: filters,
            signal: signal,
          }
        );
        setUsers(response.data.products);
        setFilteredUsers(response.data.products)
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          console.error("Error fetching employes:", err);
        }
      }
      return () => {
        controller.abort();
      };
    };

    fetchEmployes();
  }, [filters]);

  const handleEditClick = (id) => {
    navigate(`edit/${id}`);
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

  const columns = [
    {
      name: "Employee ID",
      selector: (row) => row.id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Surname",
      selector: (row) => row.surname,
      sortable: true,
      width: "150px",
    },
    {
      name: "designation",
      selector: (row) => row.designation,
      sortable: true,
      width: "150px",
    },
    {
      name: "Joining Date",
      selector: (row) => formatDate(row.joining_date),
      sortable: true,
      width: "150px",
    },
    {
      name: "Last Date",
      selector: (row) => formatDate(row.last_date),
      sortable: true,
      width: "150px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "150px",
    },
    {
      name: "DOB",
      selector: (row) => formatDate(row.DOB),
      sortable: true,
      width: "150px",
    },
    {
      name: "Personal Email",
      selector: (row) => row.personal_email,
      sortable: true,
      width: "250px",
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
        <MdDelete onClick={() => handleDeleteClick(row.name, row.surname)}>Delete</MdDelete>
      ),
      button: true,
    },
  ];

  const handleExportButtonClick = () => {
    setExportModalIsOpen(true);
  };

  const handleExportModalClose = () => {
    setExportModalIsOpen(false);
  };

  const handleApplyFilters = (filters) => {
    setFilters(filters);
  };

  const resetFilters = () => {
    setFilters({
      name: "",
      surname: ""
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post(`${API_BASE_URL}/api/Employes/importExcel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("File uploaded successfully:", response.data);
        toast.success("File uploaded successfully");
        // Optionally, update state or fetch data after successful upload
        window.location.reload()
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file");
      });
  };

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

  const CustomHeader = ({ column }) => (
    <div title={column.name} style={{ whiteSpace: "normal" }}>
      {column.name}
    </div>
  );

  const modifiedColumns = columns.map((col) => ({
    ...col,
    header: <CustomHeader column={col} />,
  }));

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || user.surname.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filteredData);
};

useEffect(() => {
  if (tableRef.current) {
    tableRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to top when page changes
  }
}, [currentPage]);

// Modify pagination options to capture page changes
const handlePageChange = (page) => {
  setCurrentPage(page); // Update the current page state
};

const customPaginationComponentOptions = {
  rowsPerPageText: "Rows per page:",
  rangeSeparatorText: "of",
  noRowsPerPage: false,
  selectAllRowsItem: false,
  onChangePage: handlePageChange, // Update the page change handler
};

  return (
    <>
    <div>
      <div ref={tableRef} className="flex items-center">
        <ExportTable
          isOpen={exportModalIsOpen}
          onClose={handleExportModalClose}
          data={filteredUsers}
        />   
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xls,.xlsx"
          className="ml-2 m-2"
        />
        <button
          onClick={handleFileUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2 m-2"
        >
          Upload Excel
        </button>
        <PiExportBold
          size={40}
          onClick={handleExportButtonClick}
        />
        <input
          type="text"
          placeholder="Search"
          onChange={handleSearch}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
        />
         <CiFilter
            size={40}
            style={{ marginLeft: "25px" }}
            onClick={handleCiFilterClick}
          />
      </div>
      <DataTable 
       className="dataTable"
       columns={modifiedColumns}
       data={filteredUsers}
       customStyles={customStyles}
       fixedHeaderScrollHeight="800px"
       striped
       theme="solarized"
       pagination
       highlightOnHover
       paginationPerPage={20}
       paginationRowsPerPageOptions={[20, 40, 60]}
       paginationComponentOptions={customPaginationComponentOptions}
       onChangePage={handlePageChange}
      />
      <FilterModal
        isOpen={filterModalIsOpen}
        onClose={() => setFilterModalIsOpen(false)}
        onApplyFilters={handleApplyFilters}
        resetFilters={resetFilters}
      />
      <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={handleCloseDeleteConfirmation}
        onDelete={() => handleDeleteConfirmation(deleteItemId)}
      />
      </div>
    </>
  );
};

export default TableEmploye;
