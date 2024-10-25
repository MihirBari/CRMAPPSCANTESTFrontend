import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "./tableUser";
import { IoMdAddCircle } from "react-icons/io";

const Maiin = () => {
  const navigate = useNavigate();

  const handleAddClick = () => {

    navigate("/adduser");
  };

  return (
    <>
      <div className="flex flex-col h-screen p-7">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-center">Users</h1>
        </div>
        <div className="flex justify-end mb-4">
        <IoMdAddCircle
        size={40}
        onClick={handleAddClick}
        />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Table />
        </div>
      </div>
      
    </>
  );
};

export default Maiin;
