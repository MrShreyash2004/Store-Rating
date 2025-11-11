import React, { useEffect, useState } from 'react'
import { getUser } from '../auth'
import api from '../api'

export default function Dashboard(){
  const user = getUser()
  const [adminStats, setAdminStats] = useState(null)
  const [recentRatings, setRecentRatings] = useState([])
  const [ownerStores, setOwnerStores] = useState([])
  const [selectedStoreRatings, setSelectedStoreRatings] = useState(null)

  useEffect(()=>{
    if (!user) return;
    if (user.role === 'admin') loadAdmin()
    if (user.role === 'owner') loadOwner()
  }, [user])

  async function loadAdmin(){
    try{
      const [dash, ratings] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/ratings')
      ])
      setAdminStats(dash.data)
      setRecentRatings(ratings.data.data)
    }catch(err){ console.error(err) }
  }

  async function loadOwner(){
    try{
      const res = await api.get('/owner/stores')
      setOwnerStores(res.data.data)
    }catch(err){ console.error(err) }
  }

  async function viewStoreRatings(storeId){
    try{
      const res = await api.get(`/owner/stores/${storeId}/ratings`)
      setSelectedStoreRatings(res.data)
    }catch(err){ console.error(err) }
  }

  if (!user) return (<div className="card">Please log in to view your dashboard.</div>)

  if (user.role === 'admin'){
    return (
      <div className="card">
        <h2>Admin Dashboard</h2>
        {adminStats ? (
          <div className="admin-stats">
            <div>Total users: <strong>{adminStats.totalUsers}</strong></div>
            <div>Total stores: <strong>{adminStats.totalStores}</strong></div>
            <div>Total ratings: <strong>{adminStats.totalRatings}</strong></div>
          </div>
        ) : <div className="muted">Loading...</div>}

        <section style={{marginTop:16}}>
          <h3>Recent Ratings</h3>
          {recentRatings.length===0 ? <div className="muted">No recent ratings</div> : (
            <ul>
              {recentRatings.map(r => (
                <li key={r.id}>{r.user?.name} rated {r.store?.name} — {r.score} <small className="muted">{new Date(r.created_at).toLocaleString()}</small></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    )
  }

  if (user.role === 'owner'){
    return (
      <div className="card">
        <h2>Owner Dashboard</h2>
        <p>Stores you own</p>
        {ownerStores.length===0 && <div className="muted">You don't own any stores yet.</div>}
        <ul>
          {ownerStores.map(s => (
            <li key={s.id} style={{marginBottom:12}}>
              <strong>{s.name}</strong> — Avg: {s.average ?? '—'} ({s.ratingsCount} ratings)
              <div><button className="btn" onClick={()=>viewStoreRatings(s.id)} style={{marginLeft:8}}>View ratings</button></div>
            </li>
          ))}
        </ul>

        {selectedStoreRatings && (
          <div style={{marginTop:12}} className="card">
            <h4>Ratings for {selectedStoreRatings.store.name}</h4>
            <div>Average: {selectedStoreRatings.averageRating ?? '—'}</div>
            <ul>
              {selectedStoreRatings.ratings.map(r => (
                <li key={r.id}>{r.user?.name} — {r.score} <small className="muted">{new Date(r.created_at).toLocaleString()}</small></li>
              ))}
            </ul>
            <div><button className="btn" onClick={()=>setSelectedStoreRatings(null)}>Close</button></div>
          </div>
        )}
      </div>
    )
  }

  return (<div className="card"><h2>User Dashboard</h2><p>Quick links and your recent activity.</p></div>)
}
