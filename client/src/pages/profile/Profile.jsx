import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import Posts from "../../components/posts/Posts";
import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const userId = location.pathname.split("/")[2] || currentUser?.id;

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    enabled: Boolean(userId),
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => {
        return res.data;
      }),
  });

  const profileUser = data || {};
  const isOwnProfile =
    Number(currentUser?.id) === Number(profileUser?.id ?? userId);

  const getImageSrc = (value, fallback) => {
    if (!value) return fallback;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return "/upload/" + value;
  };

  const coverSrc = getImageSrc(
    profileUser.coverPic,
    "https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  );
  const profileSrc = getImageSrc(
    profileUser.profilePic,
    "https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
  );

  const websiteHref = profileUser.website
    ? profileUser.website.startsWith("http://") || profileUser.website.startsWith("https://")
      ? profileUser.website
      : `https://${profileUser.website}`
    : null;

  return (
    <div className="profile">
      <div className="images">
        <img src={coverSrc} alt="" className="cover" />
        <img src={profileSrc} alt="" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="center">
            <span>{isLoading ? "Loading..." : profileUser.name || "Unknown User"}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{profileUser.city || "No city added"}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                {websiteHref ? (
                  <a href={websiteHref} target="_blank" rel="noreferrer">
                    {profileUser.website}
                  </a>
                ) : (
                  <span>No website added</span>
                )}
              </div>
            </div>
            {isOwnProfile ? (
              <Link to="/profile/edit">
                <button>Edit Profile</button>
              </Link>
            ) : (
              <button>follow</button>
            )}
          </div>
        </div>
        {error ? "Something went wrong!" : <Posts userId={profileUser?.id || userId} />}
      </div>
    </div>
  );
};

export default Profile;
