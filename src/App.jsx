import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

import ArticlesList from './pages/ArticlesList'
import ArticlePage from './pages/ArticlesPage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Header from './components/Header'

import './App.css'

export default function App() {
  const { user } = useContext(AuthContext)

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/articles" />} />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />

        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/sign-in" />}
        />
      </Routes>
    </>
  )
}