import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StoreList from './pages/StoreList'
import Dashboard from './pages/Dashboard'

export default function App(){
  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <h1 className="brand">Store<span>ly</span></h1>
          <nav className="main-nav">
            <Link to="/stores">Stores</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="cta">Sign up</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<StoreList/>} />
          <Route path="/stores" element={<StoreList/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </main>
    </div>
  )
}
