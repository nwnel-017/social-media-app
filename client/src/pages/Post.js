import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { useNavigate } from "react-router-dom";
// import { post } from "../../../server/routes/Posts";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    //seems like useEffect only gets called when page refreshes -> this might be causing issue
    console.log("useEffect hook has been called");
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            id: response.data.id, // ✅ now we include the comment ID returned from backend
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deletePost = (id) => {
    try {
      console.log("post deleting");
      axios
        .delete(`http://localhost:3001/posts/${id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then(() => {
          navigate("/");
          alert("delete success");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title: ");
      axios.put(
        "http://localhost:3001/posts/title",
        { newTitle: newTitle, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );

      setPostObject({ ...postObject, title: newTitle });
    } else if (option === "body") {
      let newBody = prompt("Enter New Post Text: ");
      axios.put(
        "http://localhost:3001/posts/postText",
        { newText: newBody, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );

      setPostObject({ ...postObject, postText: newBody });
    } else {
      navigate("/*"); //go to page not found
    }
  };

  const deleteComment = (id) => {
    //issue -> when we dont refresh after adding comment, trying to delete gives undefined id
    //if we don't refresh, comment is undefined on client side
    //problem isnt necessarily comment doesnt exist on backend, but we cant retreive id in client before refreshing
    //this problem starting happening during video 11 -> adding delete method
    try {
      console.log("executing delete on comment " + id + " on client side");
      axios
        .delete(`http://localhost:3001/comments/${id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then(() => {
          setComments(
            comments.filter((val) => {
              return val.id !== id;
            })
          );
        });
    } catch (error) {
      throw new error(error);
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div
          className="title"
          onClick={() => {
            editPost("title");
          }}
        >
          {postObject.title}
        </div>
        <div
          className="body"
          onClick={() => {
            editPost("body");
          }}
        >
          {postObject.postText}
        </div>
        <div className="footer">{postObject.username}</div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          ></input>
          <button onClick={addComment}>Add Comment</button>
          {authState.username === postObject.username && (
            <button
              onClick={() => {
                deletePost(postObject.id);
              }}
            >
              Delete Post
            </button>
          )}
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label> Username: {comment.username}</label>
                {authState.username === comment.username && (
                  <button
                    onClick={() => {
                      //console.log("deleting comment " + comment.id);
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
