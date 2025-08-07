import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/Contexts";
import { AiFillEdit } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ManageProfile = () => {
  const { userinfo, setUserinfo } = useContext(AuthContext);
  const [toogleInput, setToogleInput] = useState(false);
  const [username, setUsername] = useState(userinfo?.username);

  useEffect(() => {
    if (userinfo?.username) {
      setUsername(userinfo.username);
    }
  }, [userinfo]);

  const handleInputfield = () => {
    setToogleInput(!toogleInput);
  };
  const handleSubmit = async () => {
    if (!username) return;

    try {
      const res = await axios.put("http://127.0.0.1:5000/updateusername", {
        username: username.trim(),
        userId: userinfo.user_id,
      });
      console.log(res);
<<<<<<< HEAD
      
=======
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)

      if (res.status == 200) {
        toast.success(res.data.message || "Profile Update Sucessfully");
      }
      setUsername("");
      setUserinfo(res.data);
      setToogleInput(false);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  return (
<<<<<<< HEAD
    <div className="w-80% h-[80vh] flex  justify-center  ">
      <div className="w-[40%] h-[50vh]  relative flex-col items-center  top-10  ">
=======
    <div className="w-80% h-[80vh] flex  justify-center   ">
      <div className="w-80 md:w-[40%] h-[50vh]  relative flex-col items-center  top-10  ">
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
        <h1 className="text-4xl h-20   font-bold font-helvetica bg-background2 flex items-center justify-center">
          Manage Profile
        </h1>
        <div className="w-full h-[50vh] cursor-pointer  flex flex-col space-y-7 items-center justify-center box-border border border-background2 border-t-0">
          {userinfo?.avatar && (
<<<<<<< HEAD
            <div className="w-60 h-auto ">
=======
            <div className=" w-60 h-auto ">
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
              <img
                src={userinfo?.avatar.src}
                alt={userinfo?.avatar.alt || "avatar"}
                className="w-full h-auto object-contain"
              />
              <Link to="/profile">
<<<<<<< HEAD
                <MdEdit className="absolute top-2/3 left-72 text-3xl text-black bg-background2 border rounded-sm" />
=======
                <MdEdit className="absolute top-3/4 md:top-2/3 left-12 md:left-72 text-3xl text-black bg-background2 border rounded-sm" />
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
              </Link>
            </div>
          )}

          {toogleInput ? (
<<<<<<< HEAD
            <div className="w-[45%] flex  ml-24 items-center   justify-around">
=======
            <div className="w-60 md:w-[45%] flex  md:ml-24 items-center   justify-around">
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
              <input
                type="text"
                value={username}
                className="p-3 rounded bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1] border border-white border-opacity-20 w-[70%] h-10 "
                onChange={(e) => setUsername(e.target.value)}
              />
              <div>
                <button
                  type="button"
<<<<<<< HEAD
                  className="w-6 sm:w-auto px-6 py-2 bg-[#00acc1] font-bold font-sans text-white rounded-full hover:bg-hoverBlue transition duration-300"
=======
                  className=" sm:w-auto px-4 md:px-6 py-2 bg-[#00acc1] font-bold font-sans text-white rounded-full hover:bg-hoverBlue transition duration-300"
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
<<<<<<< HEAD
            <div className="w-[30%] flex items-center justify-evenly">
              <h1 className="text-4xl font-bold font-helvetica">
=======
            <div className="w-48 md:w-[30%] flex  items-center justify-evenly">
              <h1 className="text-auto md:text-4xl font-bold font-helvetica">
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
                {userinfo?.username}
              </h1>
              <span>
                <AiFillEdit
                  onClick={handleInputfield}
<<<<<<< HEAD
                  className="text-3xl text-background2"
=======
                  className="text-2xl md:text-3xl text-background2"
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
                />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;
