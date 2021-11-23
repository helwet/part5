import "./styles.css";
import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [username, setUsername] = useState("roberta");
  const [password, setPassword] = useState("iloveyou");
  const [user, setUser] = useState(null);
  const blogFormRef = useRef;

  // Fetch blogs from backend on initial app load
  useEffect(() => {
    const setInitialBlogs = async () => {
      try {
        const initialBlogs = await blogService.getAll();
        setBlogs(initialBlogs);
      } catch (error) {}
    };
    if (user) {
      setInitialBlogs();
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const generateBlogPosts = () => {
    var blogs2 = [...blogs];
    blogs2.map((p) => <Blog b={p} />);
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
    });
  };

  const addLikeToBlog = (id) => {
    const blog = blogs.find((n) => n.id === id);
    const changedBlog = { ...blog, likes: blog.likes + 1 };

    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)));
      })
      .catch((error) => {
        setErrorMessage(
          `Blog '${blog.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const handleBlogChange = (event) => {
    console.log(event.target.value);
    setNewBlog(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password
      });

      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  );
  const ShowBlogFormBtn = () => (
    <>
      <button
        type="button"
        onClick={() => blogFormRef.current.toggleVisibility()}
      >
        + Blog
      </button>
    </>
  );

  const HideBlogFormBtn = () => (
    <>
      <button
        type="button"
        onClick={() => blogFormRef.current.toggleVisibility()}
      >
        Hide
      </button>
    </>
  );

  const blogForm = () => (
    <Togglable
      ref={blogFormRef}
      buttons={{ show: <ShowBlogFormBtn />, hide: <HideBlogFormBtn /> }}
    >
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const sortedBlogs = [...blogs].sort((currBlog, nextBlog) => {
    return nextBlog.likes - currBlog.likes;
  });
  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage} />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged in</p>
          {BlogForm()}
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {generateBlogPosts()}
        {[...blogs].map((Blog) => (
          <Blog
            key={Blog.id}
            Blog={Blog}
            likeBlog={() => addLikeToBlog(Blog.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default App;
