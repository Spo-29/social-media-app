import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDesc, setEditedDesc] = useState(post.desc || "");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    setEditedDesc(post.desc || "");
  }, [post.id, post.desc]);

  const getImageSrc = (value) => {
    if (!value) {
      return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    }
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return "/upload/" + value;
  };

  const getPostImageSrc = (value) => {
    if (!value) return null;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return "/upload/" + value;
  };

  const { isLoading: likesLoading, data: likesData } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.id).then((res) => {
        return res.data;
      }),
    staleTime: 0,
  });

  const { data: commentsData } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + post.id).then((res) => {
        return res.data;
      }),
    staleTime: 0,
  });

  const commentsCount = Array.isArray(commentsData) ? commentsData.length : 0;
  const likes = Array.isArray(likesData) ? likesData : [];
  const liked = likes.includes(currentUser.id);
  const isOwnPost = Number(post.userId) === Number(currentUser.id);

  const mutation = useMutation({
    mutationFn: (isLiked) => {
      if (isLiked) {
        return makeRequest.delete("/likes?postId=" + post.id);
      }

      return makeRequest.post("/likes", { postId: post.id });
    },
    onMutate: async (isLiked) => {
      await queryClient.cancelQueries({ queryKey: ["likes", post.id] });

      const previousLikes = queryClient.getQueryData(["likes", post.id]);
      const safePreviousLikes = Array.isArray(previousLikes) ? previousLikes : [];

      queryClient.setQueryData(["likes", post.id], () => {
        if (isLiked) {
          return safePreviousLikes.filter((id) => id !== currentUser.id);
        }

        return [...safePreviousLikes, currentUser.id];
      });

      return { previousLikes };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["likes", post.id], context?.previousLikes);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", post.id] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: () => makeRequest.delete(`/posts/${post.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (newDesc) => makeRequest.put(`/posts/${post.id}`, { desc: newDesc }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsEditing(false);
    },
  });

  const handleLike = () => {
    if (likesLoading) return;
    mutation.mutate(liked);
  };

  const handleDeletePost = () => {
    if (!isOwnPost || deletePostMutation.isPending) return;
    deletePostMutation.mutate();
  };

  const handleStartEdit = () => {
    if (!isOwnPost) return;
    setEditedDesc(post.desc || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedDesc(post.desc || "");
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!isOwnPost || updatePostMutation.isPending) return;

    const cleanedDesc = editedDesc.trim();
    if (!cleanedDesc.length) return;

    updatePostMutation.mutate(cleanedDesc);
  };

  const postOwnerProfilePic =
    isOwnPost
      ? currentUser.profilePic
      : post.profilePic;

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={getImageSrc(postOwnerProfilePic)} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId || currentUser.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          {isOwnPost ? (
            <div className="postOwnerActions">
              {!isEditing && (
                <button
                  className="postEditBtn"
                  onClick={handleStartEdit}
                  title="Update post description"
                >
                  Update
                </button>
              )}
              <button
                className="postDeleteBtn"
                onClick={handleDeletePost}
                disabled={deletePostMutation.isPending}
                title="Delete post"
              >
                <DeleteOutlineOutlinedIcon />
              </button>
            </div>
          ) : (
            <MoreHorizIcon />
          )}
        </div>
        <div className="content">
          {isEditing ? (
            <div className="editPostBox">
              <textarea
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
                rows={3}
              />
              <div className="editActions">
                <button
                  className="saveEditBtn"
                  onClick={handleSaveEdit}
                  disabled={updatePostMutation.isPending || !editedDesc.trim()}
                >
                  {updatePostMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button className="cancelEditBtn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p>{post.desc}</p>
          )}
          {post.img && <img src={getPostImageSrc(post.img)} alt="" />}
        </div>
        <div className="info">
          <div className="item" onClick={handleLike}>
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            {likes.length} {likes.length === 1 ? "Like" : "Likes"}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
