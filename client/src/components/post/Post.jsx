import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./post.scss";
import {useQuery} from '@tanstack/react-query'



const Posts = () =>{

  const{isLoading,error,data}= useQuery(['posts'],()=>
    makeRequest.get("/posts").then ((res)=>{
      return res.data;
    })
  );


console.log(data)
return <div className="posts">
  { error ? "Something Went Wrong!" :isLoading? "isLoading":
  data.map((post)=>
    <Post post={post} key ={post.id}></Post>
  )}
</div>;
};

export default Posts;