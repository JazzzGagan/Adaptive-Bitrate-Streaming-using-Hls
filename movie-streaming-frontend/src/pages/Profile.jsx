import axios from "axios";
import avatarList from "../Utils/avatarList";
import { useContext, useState } from "react";
import { AuthContext } from "../context/Contexts";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { userinfo, setUserinfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedAvatar, setSelectedAvatar] = useState(null);
<<<<<<< HEAD
  
=======

>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const updateProfile = async () => {
    if (!selectedAvatar) return;
    const payload = {
      selectedAvatar,
      userId: userinfo?.user_id,
    };
    try {
      const res = await axios.put(
<<<<<<< HEAD
        "http://127.0.0.1:5000/updateprofile",
=======
        "http://192.168.101.5:5000/updateprofile",
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
        payload
      );
      setUserinfo(res.data);
      setSelectedAvatar(null);
      toast.success(res.data.message || "Profile Update Sucessfully");
      setTimeout(() => {
        navigate("/manageprofile");
      }, 1000);
    } catch (err) {
      console.error("Error updating username:", err);
    }
  };

  return (
    <div className="w-full h-auto bg-slate-black flex items-center justify-center bg-black">
      <div className="w-[80%] h-auto  ">
        <div className="w-full h-[10vh] flex items-center">
<<<<<<< HEAD
          <h1 className="font-helvetica text-6xl font-bold text-background2 ">
=======
          <h1 className="font-helvetica text-3xl md:text-6xl font-bold text-background2 ">
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
            Select an avatar
          </h1>
        </div>

<<<<<<< HEAD
        <div className="w-full h-auto  grid grid-cols-8 gap-4 cursor-pointer ">
=======
        <div className="w-full h-auto  grid grid-cols-4 md:grid-cols-8 gap-4 cursor-pointer ">
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
          {avatarList.map((avatar, index) => (
            <div key={index} className="flex items-center  ">
              <img
                src={avatar.src}
                alt={avatar.alt}
                className={`object-contain w-full h-auto border-4 ${
                  selectedAvatar?.src === avatar.src
                    ? "border-background2 "
                    : "border-transparent"
                } `}
                onClick={() => handleSelect(avatar)}
              />
            </div>
          ))}
        </div>
        <button
          onClick={updateProfile}
          className="w-32 mt-10 bg-[#00acc1] hover:bg-cyan-600 text-white font-semibold py-3 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Profile;
