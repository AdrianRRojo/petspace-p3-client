import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/pages/Login'
import Profile from './components/pages/Profile'
import Register from './components/pages/Register'
import Posts from './components/pages/Posts'
import Navbar from './components/partials/Navbar'
import './App.css'
import jwt_decode from 'jwt-decode'

import NewPost from './components/pages/NewPost'
import Post from './components/pages/Post'
import Search from './components/pages/Search'
import EditComment from './components/pages/EditComment'
import EditPost from './components/pages/EditPost'
import EditProfile from './components/pages/EditProfile'



function App() {
  // the currently logged in user will be stored up here in state
  const [currentUser, setCurrentUser] = useState(null)

  // useEffect -- if the user navigates away form the page, we will log them back in
  useEffect(() => {
    // check to see if token is in storage
    const token = localStorage.getItem('jwt')
    if (token) {
      // if so, we will decode it and set the user in app state
      setCurrentUser(jwt_decode(token))
    } else {
      setCurrentUser(null)
    }
  }, []) // happen only once

  // event handler to log the user out when needed
  const handleLogout = () => {
    // check to see if a token exists in local storage
    if (localStorage.getItem('jwt')) {
      // if so, delete it
      localStorage.removeItem('jwt')
      // set the user in the App state to be null
      setCurrentUser(null)
    }
  }

  return (
    <Router>
      <header>
        <Navbar 
          currentUser={currentUser}
          handleLogout={handleLogout}
        />
      </header>

      <div className="App">
        <Routes>
          <Route 
            path="/posts"
            element={<Posts currentUser={currentUser} setCurrentUser={setCurrentUser} />}
          />

          <Route 
            path="/register"
            element={<Register currentUser={currentUser} setCurrentUser={setCurrentUser} />}
          />

          <Route 
            path="/"
            element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser} />}
          />

          {/* conditionally render auth locked routes */}
          <Route 
            path="/:username"
            element={currentUser ? <Profile handleLogout={handleLogout} currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/" />}
          />




          <Route 
            path="/posts/:postid/comment/:commentid/edit"
            element={<EditComment />}
          />
           <Route 
            path="posts/:postid/edit"
            element={<EditPost />}
          />
           <Route 
            path="/posts/new"
            element={<NewPost currentUser={currentUser} setCurrentUser={setCurrentUser}/>}
          />
           <Route 
            path="/posts/:postid"
            element={<Post />}
          />
           <Route 
            path="/:username/edit"
            element={<EditProfile />}
          />
           <Route 
            path="/search"
            element={<Search />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
