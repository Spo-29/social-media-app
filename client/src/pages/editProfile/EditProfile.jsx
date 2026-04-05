import "./editProfile.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { currentUser, updateCurrentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [coverFile, setCoverFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [inputs, setInputs] = useState({
    username: currentUser?.username || "",
    name: currentUser?.name || "",
    city: currentUser?.city || "",
    website: currentUser?.website || "",
  });

  const upload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await makeRequest.post("/upload", formData);
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: (payload) => makeRequest.put("/users", payload),
    onSuccess: (res) => {
      updateCurrentUser(res.data);
      queryClient.invalidateQueries({ queryKey: ["user", currentUser.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/profile/" + currentUser.id);
    },
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let coverPic = currentUser?.coverPic || null;
    let profilePic = currentUser?.profilePic || null;

    if (coverFile) {
      coverPic = await upload(coverFile);
    }

    if (profileFile) {
      profilePic = await upload(profileFile);
    }

    mutation.mutate({
      ...inputs,
      coverPic,
      profilePic,
    });
  };

  const getImageSrc = (value) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return "/upload/" + value;
  };

  return (
    <div className="editProfile">
      <div className="card">
        <h1>Edit Profile</h1>
        <form>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={inputs.username}
            onChange={handleChange}
          />

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleChange}
          />

          <label>City</label>
          <input
            type="text"
            name="city"
            value={inputs.city}
            onChange={handleChange}
          />

          <label>Website</label>
          <input
            type="text"
            name="website"
            value={inputs.website}
            onChange={handleChange}
          />

          <label>Profile Picture</label>
          {profileFile ? (
            <img
              src={URL.createObjectURL(profileFile)}
              alt="Profile preview"
              className="preview"
            />
          ) : (
            currentUser?.profilePic && (
              <img
                src={getImageSrc(currentUser.profilePic)}
                alt="Current profile"
                className="preview"
              />
            )
          )}
          <input type="file" onChange={(e) => setProfileFile(e.target.files[0])} />

          <label>Cover Picture</label>
          {coverFile ? (
            <img
              src={URL.createObjectURL(coverFile)}
              alt="Cover preview"
              className="preview cover"
            />
          ) : (
            currentUser?.coverPic && (
              <img
                src={getImageSrc(currentUser.coverPic)}
                alt="Current cover"
                className="preview cover"
              />
            )
          )}
          <input type="file" onChange={(e) => setCoverFile(e.target.files[0])} />

          <div className="actions">
            <button className="saveBtn" onClick={handleSubmit} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="backBtn"
              onClick={() => navigate("/profile/" + currentUser.id)}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
