import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import "./style.css";
import { CiFilter } from "react-icons/ci";
import { FaExclamationTriangle } from "react-icons/fa";
import FilterModal from "./filterModal.jsx";
import axios from "axios";

const Main = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    customerEntity: "",
    status: "",
  });

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/opportunity/sendAlert`
        );
        setAlerts(response.data.products);
        setFilteredUsers(response.data.products);
        //console.log(response.data.products);
        // Update loading state
      } catch (error) {
        console.error("Error fetching customer details:", error);
        // Update loading state even if there's an error
      }
    };

    fetchAlerts();
  }, [filters]);

  const acknowledgeAlert = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/Opportunity/acknowledge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      window.location.reload(); // Reload the page after acknowledgment
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const Remind = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/Opportunity/reminder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

     window.location.reload(); // Reload the page after acknowledgment
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const PoLost = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/Opportunity/PoLost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      window.location.reload(); // Reload the page after PO lost
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData);
    setFilterModalIsOpen(false);
  };

  const initialFilters = {
    customerEntity: "",
    status: "",
  };

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  return (
    <div className="h-screen flex-1 p-7 bg-gray-50">
      <h1 className="text-2xl font-semibold text-center">Alerts</h1>
      <div>
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
        />
      </div>
      {alerts.length === 0 ? (
        <p className="text-xl p-7 text-center">No alerts present</p>
      ) : (
        <div className="alert-container">
          {Array.isArray(alerts) &&
            filteredUsers.map((alert) => (
              <div key={alert.id} className="alert-box shadow ">
                <h2>
                  {alert.daysLeft >= 31 && alert.daysLeft <= 45 && "Reminder"}
                  {alert.daysLeft >= 16 && alert.daysLeft <= 30 && "Warning"}
                  {alert.daysLeft <= 15 && "Urgent"}
                  {alert.daysLeft <= 15 && alert.acknowledge === "No" && (
                    <FaExclamationTriangle className="warning-icon" />
                  )}
                </h2>
                <p>
                  Opportunity for <b>{alert.alert_entity}</b> for{" "}
                  {alert.alert_description} in {alert.alert_type} for <b>{alert.License_type} License Type</b> expiring in {alert.daysLeft} days on {alert.license_to}
                </p>
                {alert.daysLeft <= 15 ? (
                  <div className="button-container">
                    <button
                      className="po-received-button"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      PO Won
                    </button>
                    <button
                      className="po-lost-button"
                      onClick={() => PoLost(alert.id)}
                    >
                      PO Lost
                    </button>
                  </div>
                ) : alert.daysLeft <= 45 && alert.daysLeft >= 16 ? (
                  <button
                    className="po-received-button"
                    onClick={() => Remind(alert.id)}
                  >
                    Remind Me Later
                  </button>
                ) : null}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Main;
