import React, { useState } from 'react';
import SideNavBar from '../Sidebar/Navbar';
import Maiin from './maiin'; // Assuming 'maiin' is correctly imported
import HiddenPo from './hiddenPo.jsx'; // Assuming 'HiddenPo' is another component

const PO = () => {
  const [showHiddenPo, setShowHiddenPo] = useState(false);

  // Toggle the display of HiddenPo component
  const handleToggleHiddenPo = () => {
    setShowHiddenPo((prevState) => !prevState);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNavBar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4">
        {/* Button to toggle Hidden PO */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleToggleHiddenPo}
          >
            {showHiddenPo ? "Back to PO List" : "Show Hidden PO"}
          </button>
        </div>

        {/* Conditionally render HiddenPo or Maiin component */}
        {showHiddenPo ? <HiddenPo /> : <Maiin />}
      </div>
    </div>
  );
};

export default PO;
