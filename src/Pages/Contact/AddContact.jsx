import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import Modal from "react-modal";
import { AuthContext } from "../../context/AuthContext";

const AddContact = ({ isOpen, onClose, customer_entity }) => {
  const initialInputs = {
    customer_entity: customer_entity,
    contacts: [{ name: "", designation: "", phone: "", email: "" }],
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [err, setError] = useState(null);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (
      name === "name" ||
      name === "designation" ||
      name === "phone" ||
      name === "email"
    ) {
      const newContacts = [...inputs.contacts];
      if (!newContacts[index]) {
        newContacts[index] = {};
      }
      newContacts[index][name] = value;
      setInputs((prev) => ({
        ...prev,
        customer_entity: customer_entity,
        contacts: newContacts,
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addContact = () => {
    setInputs((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        { name: "", designation: "", phone: "", email: "" },
      ],
    }));
  };

  const removeContact = (index) => {
    const newContacts = [...inputs.contacts];
    newContacts.splice(index, 1);
    setInputs((prev) => ({
      ...prev,
      contacts: newContacts,
    }));
  };

  const { currentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to backend
      await axios.post(`${API_BASE_URL}/api/Contact/addContact`, inputs, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });
      setInputs(initialInputs);
      toast.success("Contact created successfully");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.response);
      toast.error("Failed to create Contact");
    }
  };

  const handleClose = async (e) => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          zIndex: 9999,
        },
        content: {
          height: "80%",
          width: "50%",
          margin: "auto",
        },
      }}
    >
      <div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add Contact
          </h2>
        </div>
        <div className="mt-8 sm:w-full">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="customer_entity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name Of Customer Entity
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="customer_entity"
                      required
                      readOnly
                      onChange={handleChange}
                      placeholder="Name Of Customer Entity"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={inputs.customer_entity}
                    />
                  </div>
                </div>

                {inputs.contacts.map((contact, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact {index + 1}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeContact(index)}
                          className="ml-2 text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:underline"
                        >
                          Remove
                        </button>
                      )}
                    </label>
                    <div className="grid grid-rows-3 gap-4">
                      <div>
                        <input
                          type="text"
                          name="name"
                          required
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Enter Name Of Customer"
                          value={contact.name}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]" // Increase height here
                        />
                      </div>

                      <div className="relative">
                        <select
                          name="designation"
                          required
                          onChange={(e) => handleChange(e, index)}
                          value={contact.designation}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px] pr-10" // Added pr-10 for padding
                        >
                          <option value="" disabled selected>
                            Select Designation
                          </option>
                          <option value="CISO">CISO</option>
                          <option value="CTO">CTO</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>

                      <div>
                        <input
                          type="number"
                          name="phone"
                          required
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Phone Number"
                          value={contact.phone}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]" // Increase height here
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          required
                          onChange={(e) => handleChange(e, index)}
                          placeholder="E-Mail"
                          value={contact.email}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]" // Increase height here
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addContact}
                  className="text-sm font-medium text-blue-600 "
                >
                  + Addct
                </button>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handleSubmit}
                  className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create
                </button>

                <button
                  onClick={handleClose}
                  className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddContact;
