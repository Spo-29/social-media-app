import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import "./friends.scss";
import { ArrowBackOutlined, PersonRemove } from "@mui/icons-material";

const Friends = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Get followings (friends)
  const { isLoading, data: friends } = useQuery({
    queryKey: ["followings", currentUser?.id],
    queryFn: () =>
      makeRequest
        .get(`/relationships/followings/${currentUser.id}`)
        .then((res) => res.data),
    enabled: !!currentUser?.id,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "stale",
  });

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: (userId) =>
      makeRequest.delete(`/relationships/unfollow`, {
        data: { userId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followings", currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["followStatus"] });
    },
  });

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    if (imagePath.startsWith("http")) return imagePath;
    return `/upload/${imagePath}`;
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleUnfollow = (userId, e) => {
    e.stopPropagation();
    unfollowMutation.mutate(userId);
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <div className="friends">
      <div className="container">
        <div className="header">
          <button className="backBtn" onClick={handleBackClick}>
            <ArrowBackOutlined />
            <span>Back</span>
          </button>
          <h1>Your Friends</h1>
          <div style={{ width: "86px" }}></div> {/* For alignment */}
        </div>

        {isLoading ? (
          <div className="loading">Loading friends...</div>
        ) : friends && friends.length > 0 ? (
          <div className="friendsList">
            {friends.map((friend) => (
              <div key={friend.id} className="friendCard">
                <div
                  className="friendInfo"
                  onClick={() => handleProfileClick(friend.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={getImageSrc(friend.profilePic)}
                    alt={friend.name}
                    className="profileImg"
                  />
                  <div className="userDetails">
                    <h3>{friend.name}</h3>
                    <p className="username">@{friend.username}</p>
                    {friend.city && <p className="city">📍 {friend.city}</p>}
                  </div>
                </div>
                <button
                  className="unfollowBtn"
                  onClick={(e) => handleUnfollow(friend.id, e)}
                  disabled={unfollowMutation.isPending}
                >
                  <PersonRemove />
                  <span>Unfriend</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="noFriends">
            <p>You haven't followed anyone yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
