
import { Link } from "react-router-dom";

const ExpenseDetails = ({ product }) => {
  const {
    customer_entity,
    name,
    designation,
    phone,
    email,
    address,
    city,
    state,
    website
  } = product;


 
  return (
    <div className="flex flex-col justify-center items-center mt-2">
      <div className="flex flex-col md:flex-row justify-center items-center mt-8">
 

        <div className="max-w-md w-full md:w-1/2  p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Name : <span>{customer_entity} </span></h2>
          <p className="text-gray-800 font-semibold mb-2">
            Amount : ₹ {name}
          </p>
          <p className="text-gray-800 font-semibold mb-2">
            Paid status : {designation}
          </p>
          <p className="text-gray-800 font-semibold mb-2">
            Paid By :  {phone}
          </p>
          <p className="text-gray-800 font-semibold mb-2">
           Remark :  {email}
          </p>
          <p className="text-gray-800 font-semibold mb-2">Clearance Status : {address}</p>
          <p className="text-gray-800 font-semibold mb-2">Payment Mode : {city}</p>
          <p className="text-gray-800 font-semibold mb-2">Payment Mode : {state}</p>
          <p className="text-gray-800 font-semibold mb-2">Payment Mode : {website}</p>
        </div>
      </div>

      <Link to="/Expense">
        <button className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 ">
          Back
        </button>
      </Link>
    </div>
  );
};

export default ExpenseDetails;
