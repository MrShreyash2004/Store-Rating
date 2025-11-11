import React, { useState } from 'react'
import api from '../api'
import { saveAuth } from '../auth'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(null)
    try{
      const res = await api.post('/auth/login', { email, password })
      saveAuth(res.data.token, res.data.user)
      nav('/')
    }catch(err){
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="auth-card card">
      <h2>Welcome back</h2>
      <form onSubmit={submit} className="form">
        <label>Email
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </label>
        <label>Password
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn primary" type="submit">Log in</button>
      </form>
    </div>
  )
}
