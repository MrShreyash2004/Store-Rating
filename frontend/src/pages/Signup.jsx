import React, { useState } from 'react'
import api from '../api'
import { saveAuth } from '../auth'
import { useNavigate } from 'react-router-dom'

function validateName(name){ return name.length>=20 && name.length<=60 }
function validatePassword(p){ return /(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}/.test(p) }

export default function Signup(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [address,setAddress]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState(null)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault(); setError(null)
    if(!validateName(name)){ setError('Name must be 20-60 characters'); return }
    if(!validatePassword(password)){ setError('Password must be 8-16 chars, include uppercase and special char'); return }
    try{
      const res = await api.post('/auth/signup',{ name,email,address,password })
      saveAuth(res.data.token,res.data.user)
      nav('/')
    }catch(err){ setError(err.response?.data?.message || 'Signup failed') }
  }

  return (
    <div className="auth-card card">
      <h2>Create your account</h2>
      <form onSubmit={submit} className="form">
        <label>Name
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </label>
        <label>Email
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </label>
        <label>Address
          <textarea value={address} onChange={e=>setAddress(e.target.value)} maxLength={400} />
        </label>
        <label>Password
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn primary" type="submit">Sign up</button>
      </form>
    </div>
  )
}
