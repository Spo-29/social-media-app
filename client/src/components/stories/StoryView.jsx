import React, { useEffect, useState } from "react";
import "./storyView.scss";
import moment from "moment";

const StoryView = ({ stories, storyId, setViewStoryId }) => {
  const [currentStory, setCurrentStory] = useState(null);

  useEffect(() => {
    setCurrentStory(stories.find((s) => s.id === storyId));
  }, [stories, storyId]);

  if (!currentStory) return null;

  return (
    <div className="storyView" onClick={() => setViewStoryId(null)}>
      <div className="overlay"></div>
      <div className="storyContent" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={() => setViewStoryId(null)}>
          ×
        </button>
        <div className="userInfo">
          <img src={currentStory.profilePic} alt="" />
          <div className="userText">
            <span className="username">{currentStory.username}</span>
            <span className="time">{moment(currentStory.createdAt).fromNow()}</span>
          </div>
        </div>
        <img src={currentStory.img} alt="" className="mainImage" />
      </div>
    </div>
  );
};

export default StoryView;