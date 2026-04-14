import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  const queryClient = useQueryClient();

  const getImageSrc = (value) => {
    if (!value) {
      return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    }
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return "/upload/" + value;
  };

  const { isLoading, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => {
        return res.data;
      }),
    staleTime: 0,
  });

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setDesc("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId) => makeRequest.delete(`/comments/${commentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    const cleanedDesc = desc.trim();
    if (!cleanedDesc) return;

    mutation.mutate({ desc: cleanedDesc, postId });
  };

  const handleDeleteComment = (commentId) => {
    if (deleteMutation.isPending) return;
    deleteMutation.mutate(commentId);
  };

  const comments = Array.isArray(data) ? data : [];

  return (
    <div className="comments">
      <div className="write">
        <img src={getImageSrc(currentUser.profilePic)} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading
        ? "loading"
        : comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={getImageSrc(comment.profilePic)} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <div className="actions">
              <span className="date">{moment(comment.createdAt).fromNow()}</span>
              {Number(comment.userId) === Number(currentUser.id) && (
                <button
                  className="commentDeleteBtn"
                  onClick={() => handleDeleteComment(comment.id)}
                  title="Delete comment"
                >
                  <DeleteOutlineOutlinedIcon />
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Comments;
