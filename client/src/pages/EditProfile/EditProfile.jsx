import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser.name || "");
  const [city, setCity] = useState(currentUser.city || "");
  const [website, setWebsite] = useState(currentUser.website || "");
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log("Upload error:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let profilePic = currentUser.profilePic;
      let coverPic = currentUser.coverPic;

      if (profileFile) {
        profilePic = await upload(profileFile);
      }

      if (coverFile) {
        coverPic = await upload(coverFile);
      }

      const updatedUser = {
        id: currentUser.id,
        name,
        city,
        website,
        profilePic,
        coverPic,
      };

      await makeRequest.put("/users", updatedUser);

      setCurrentUser({
        ...currentUser,
        ...updatedUser,
      });

      alert("Profile updated successfully");
      navigate(`/profile/${currentUser.id}`);
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "10px", margin: "20px" }}>
      <h2>Edit Profile</h2>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px" }}
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px" }}
        />

        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px" }}
        />

        <label>Profile Picture:</label>
        <input
          type="file"
          onChange={(e) => setProfileFile(e.target.files[0])}
          style={{ display: "block", marginBottom: "10px" }}
        />

        <label>Cover Picture:</label>
        <input
          type="file"
          onChange={(e) => setCoverFile(e.target.files[0])}
          style={{ display: "block", marginBottom: "10px" }}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;