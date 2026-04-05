import { useContext, useEffect, useRef, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Stories = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { currentUser } = useContext(AuthContext);

  const { isLoading, data } = useQuery({
    queryKey: ["stories"],
    queryFn: () =>
      makeRequest.get("/stories").then((res) => {
        return res.data;
      }),
  });

  const getImageSrc = (value) => {
    if (!value) {
      return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    }
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return "/upload/" + value;
  };

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await makeRequest.post("/upload", formData);
    return res.data;
  };

  const addMutation = useMutation({
    mutationFn: (img) => {
      return makeRequest.post("/stories", { img });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      setFile(null);
      setPreviewUrl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (storyId) => {
      return makeRequest.delete("/stories/" + storyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleStoryAdd = async () => {
    if (!file) return;
    const img = await upload();
    addMutation.mutate(img);
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleStoryFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleDeleteStory = (e, storyId) => {
    e.stopPropagation();
    deleteMutation.mutate(storyId);
  };

  const stories = Array.isArray(data) ? data : [];
  const ownStoryImage = previewUrl || getImageSrc(currentUser.profilePic);

  return (
    <div className="stories">
      <div className="story">
        <img src={ownStoryImage} alt="" />
        <span>{currentUser.name}</span>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleStoryFileChange}
        />
        {file ? (
          <button className="confirmStoryBtn" onClick={handleStoryAdd}>
            {addMutation.isPending ? "..." : <CheckIcon />}
          </button>
        ) : (
          <button className="addStoryBtn" type="button" onClick={handleOpenFilePicker}>+</button>
        )}
      </div>
      {isLoading
        ? "loading"
        : stories.map((story) => (
        <div className="story" key={story.id}>
          <img src={getImageSrc(story.img)} alt="" />
          <span>{story.name}</span>
          {Number(story.userId) === Number(currentUser.id) && (
            <button
              className="deleteStoryBtn"
              type="button"
              onClick={(e) => handleDeleteStory(e, story.id)}
              title="Delete story"
            >
              <DeleteOutlineIcon />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stories;