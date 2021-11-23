import React from "react";
import PropTypes from 'prop-types'

const Blog = ({ blog, toggleImportance }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const label = blog.title;

  return (
    <div style={blogStyle}>
    <li className="blog">
    <div>
      {blog.title}
      link : {blog.url}
      author : {blog.author}
      likes : {blog.likes}
      <button onClick={addLikeToBlog(Blog.id)}></button>
    </div>
    </li>
    </div>
  );
};
/*
const Blog = ({ blog }) => {
  return (
    <div>
      {blog.title}
      link : {blog.url}
      author : {blog.author}
      likes : {blog.likes} toggleImportance={() => addLikeToBlog(Blog.id)}
    </div>
  );
};
*/
export default Blog;
