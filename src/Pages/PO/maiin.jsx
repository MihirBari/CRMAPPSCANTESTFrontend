import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import "./style.css";
import { CiFilter } from "react-icons/ci";
import FilterModal from "./filterModal.jsx";
import axios from "axios";

const Main = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    designation: "",
    name: "",
  });
  const [popupAlerts, setPopupAlerts] = useState([]); // State for multiple popup alerts

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Opportunity/sendPo`);
        const data = await response.json();
        setAlerts(data.products || []);
        //console.log(data.products);
        setFilteredUsers(data.products || []);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  useEffect(() => {
    const checkForPopupAlerts = () => {
      const alertsToPopup = alerts.filter(
        (alert) => alert.daysLeft === 1 && alert.acknowledge === "Yes"
      );
      setPopupAlerts(alertsToPopup);
    };

    checkForPopupAlerts();
  }, [alerts]);

  const acknowledgePopupAlert = (id) => {
    setPopupAlerts((prevPopupAlerts) =>
      prevPopupAlerts.filter((alert) => alert.id !== id)
    );
  };

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData);
    setFilterModalIsOpen(false);
  };

  const initialFilters = {
    designation: "",
    name: "",
  };

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  const handleAlertClick = async (
    alert_entity,
    alert_description,
    alert_type,
    License_type
  ) => {
    console.log("clicked")
    try {
      const response = await axios.post(`${API_BASE_URL}/api/opportunity/editAlertOpportunity`, {
        alert_entity,
        alert_description,
        alert_type,
        License_type,
      });
      
      const { id } = response.data; // Assuming the backend returns an object with the id
  
      window.location.href = `/Opportunity/view/${id}`; // Redirect to the new URL
    } catch (error) {
      console.error("Error editing alert opportunity:", error);
    }
  };

  return (
    <div className="h-screen flex-1 p-7">
      <h1 className="text-2xl font-semibold text-center">PO</h1>
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
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            filteredUsers.map((alert) => (
              <div key={alert.id} className="alert-box">
                <h2>PO WON!!</h2>
                <p
                
                onClick={() =>
                  handleAlertClick(
                    alert.alert_entity,
                    alert.alert_description,
                    alert.alert_type,
                    alert.License_type
                  )
                }>
                  PO of <b>{alert.alert_entity}</b> for{" "}
                  {alert.alert_description} in {alert.alert_type} {alert.License_type} was won
                </p>
                <div className="button-container"></div>
              </div>
            ))
          ) : (
            <p className="text-xl p-7 text-center">No filtered alerts present</p>
          )}
        </div>
      )}
      {popupAlerts.map((alert) => (
        <div key={alert.id} className="popup-alert">
          <h2>PO WON</h2>
          <p>
            Opportunity for <b>{alert.alert_entity}</b> for{" "}
            {alert.alert_description} in {alert.alert_type} has been won
            please make required changes
          </p>
          <div className="button-container">
            <button
              className="po-received-button"
              onClick={() => acknowledgePopupAlert(alert.id)}
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Main;
