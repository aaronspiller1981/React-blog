import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './components/Home';
import NewPost from './components/NewPost';
import PostPage from './components/PostPage';
import EditPost from './components/EditPost';
import About from './components/About';
import Missing from './components/Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from './api/posts';
import useWindowSize from './hooks/useWindowSize';
import useAxiosFetch from './hooks/useAxiosFetch';



function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate();
  const {width} = useWindowSize();

  const {data, fetchError, isLoading} = useAxiosFetch('http://localhost:3500/posts');

  useEffect(() => {
    setPosts(data);
  }, [data])


  useEffect(() => {
      const filteredResults = posts.filter(post =>
        ((post.body).toLowerCase()).includes(search.toLowerCase())
        || ((post.title).toLowerCase()).includes(search.toLowerCase()));
        setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const handleSubmit = async (e) => {
       e.preventDefault();
       const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
       const datetime = format(new Date(), 'MMMM dd, yyyy pp');
       const newPost = { id, title: postTitle, datetime, body: postBody };
      try {
          const response = await api.post('/posts', newPost);
          const allPosts = [ ...posts, response.data ];
          setPosts(allPosts);
          setPostTitle('');
          setPostBody('');
          navigate('/');
       } catch (err) {
         console.log(`ERROR: ${err.message}`)
      }
  }

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ? { ...response.data } : post ));
      setEditTitle('');
      setEditBody(''); 
      navigate('/');  
    } catch (err) {
        console.log(err.message);
    }

  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`)
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList);
      navigate('/');
    } catch (err) {
       console.log(err.message);
    }
  }

  return (
    <div className='App'>
      <Header title="React Blog" width={width}/>
      <Nav search={search} setSearch={setSearch}/>
      <Routes>
        <Route exact path='/' element={<Home 
        posts={searchResults}
        fetchError={fetchError}
        isLoading={isLoading}
        />} />
        <Route exact path='/post' element={<NewPost 
          handleSubmit={handleSubmit}
          postTitle={postTitle}
          setPostTitle={setPostTitle}
          postBody={postBody}
          setPostBody={setPostBody}
        />} />
        <Route path='/edit/:id' element={<EditPost 
          posts={posts}
          handleEdit={handleEdit}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editBody={editBody}
          setEditBody={setEditBody}
        />} />
        <Route path='/post/:id' element={<PostPage posts={posts} handleDelete={handleDelete}/>} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;


/* npm i react-icons --D      import es6 icons at top eg.. import { FaTrashAlt } from 'react-icons/fa'  then use as component <FaTrashAlt /> */
/* highlight then shift + alt + down arrow to duplicate */
/* highlight text then shift + alt + a to use comments */
/* alt + arrow up/down to move line */