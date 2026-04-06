import { useContext, useEffect, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StoryView from "./StoryView";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [viewStoryId, setViewStoryId] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/stories?userId=" + currentUser.id);
        setStories(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStories();
  }, [currentUser.id]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      
      const imgUrl = "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg";

      await axios.post("http://localhost:8800/api/stories", {
        img: imgUrl,
        userId: currentUser.id,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (storyId, e) => {
    e.stopPropagation(); 
    try {
      await axios.delete(`http://localhost:8800/api/stories/${storyId}?userId=${currentUser.id}`);
      setStories(stories.filter((s) => s.id !== storyId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="stories">
      <div className="story addStory">
        <label htmlFor="storyFile">
          <div className="button">+</div>
          <span className="addText">Add Story</span>
        </label>
        <input type="file" id="storyFile" style={{ display: "none" }} onChange={handleUpload} />
      </div>
      
      {stories.map((story) => (
        <div className="story" key={story.id} onClick={() => setViewStoryId(story.id)}>
          <img src={story.img} alt="" />
          <span>{story.username}</span>
          {story.userId === currentUser.id && (
            <button className="deleteBtn" onClick={(e) => handleDelete(story.id, e)}>
              <DeleteOutlineIcon style={{ fontSize: "16px" }} />
            </button>
          )}
        </div>
      ))}
      
      {viewStoryId && (
        <StoryView stories={stories} storyId={viewStoryId} setViewStoryId={setViewStoryId} />
      )}
    </div>
  );
};

export default Stories;