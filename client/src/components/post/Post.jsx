import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
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
  });

  const { data: commentsData } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + post.id).then((res) => {
        return res.data;
      }),
  });

  const commentsCount = Array.isArray(commentsData) ? commentsData.length : 0;
  const likes = Array.isArray(likesData) ? likesData : [];
  const liked = likes.includes(currentUser.id);

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

  const handleLike = () => {
    if (likesLoading) return;
    mutation.mutate(liked);
  };

  const postOwnerProfilePic =
    Number(post.userId) === Number(currentUser.id)
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
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.desc}</p>
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
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
