import "./rightBar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);

  // Fetch latest activities (profile/cover updates)
  const { isLoading, data: activities } = useQuery({
    queryKey: ["activities"],
    queryFn: () =>
      makeRequest.get("/posts").then((res) => {
        // Filter for profile/cover updates only and limit to latest ones
        return res.data
          .filter(
            (post) =>
              post.desc &&
              (post.desc.includes("Updated profile picture") ||
                post.desc.includes("Updated cover picture"))
          )
          .slice(0, 10); // Show top 10 latest activities
      }),
    enabled: !!currentUser?.id,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "stale",
  });

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600";
    if (imagePath.startsWith("http")) return imagePath;
    return `/upload/${imagePath}`;
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Latest Activities</span>
          {isLoading ? (
            <div className="loading">Loading activities...</div>
          ) : activities && activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="user">
                <div className="userInfo">
                  <img
                    src={getImageSrc(activity.profilePic)}
                    alt={activity.name}
                    onError={(e) => {
                      e.target.src =
                        "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600";
                    }}
                  />
                  <p>
                    <span>{activity.name}</span>{" "}
                    {activity.desc === "Updated profile picture"
                      ? "changed their profile picture"
                      : "changed their cover picture"}
                  </p>
                </div>
                <span className="timestamp">
                  {moment(activity.createdAt).fromNow()}
                </span>
              </div>
            ))
          ) : (
            <div className="noActivities">
              <p>No recent activities yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
