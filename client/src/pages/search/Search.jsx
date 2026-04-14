import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import "./search.scss";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const query = searchParams.get("q") || "";

  // Search users
  const { isLoading, data: results } = useQuery({
    queryKey: ["search", query],
    queryFn: () => makeRequest.get(`/users/search?q=${query}`).then((res) => res.data),
    enabled: query.length > 0,
    staleTime: 0,
  });

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    if (imagePath.startsWith("http")) return imagePath;
    return `/upload/${imagePath}`;
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="search">
      <div className="container">
        <h1>Search Results</h1>
        <p className="searchQuery">
          Showing results for: <strong>"{query}"</strong>
        </p>

        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : results && results.length > 0 ? (
          <div className="searchResults">
            {results.map((user) => (
              <div key={user.id} className="searchResultCard">
                <img
                  src={getImageSrc(user.profilePic)}
                  alt={user.name}
                  className="profileImg"
                  onClick={() => handleProfileClick(user.id)}
                  style={{ cursor: "pointer" }}
                />
                <div className="userInfo">
                  <h3 onClick={() => handleProfileClick(user.id)} style={{ cursor: "pointer" }}>
                    {user.name}
                  </h3>
                  <p className="username">@{user.username}</p>
                  {user.city && <p className="city">📍 {user.city}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : query.length > 0 ? (
          <div className="noResults">
            <p>❌ No user found</p>
          </div>
        ) : (
          <div className="noQuery">
            <p>Enter a username or name to search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
