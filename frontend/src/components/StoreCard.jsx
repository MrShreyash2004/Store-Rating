import React, { useState } from 'react'
import api from '../api'

function Stars({ value, onChange }){
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n=> (
        <button key={n} type="button" className={`star ${n<=value? 'active':''}`} onClick={()=>onChange(n)} aria-label={`Rate ${n}`}>
          ★
        </button>
      ))}
    </div>
  )
}

export default function StoreCard({ store, onRatingUpdated }){
  const [rating, setRating] = useState(store.userRating || 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function submitRating(score){
    setError(null); setLoading(true)
    try{
      await api.post(`/ratings/${store.id}`, { score })
      setRating(score)
      onRatingUpdated && onRatingUpdated(store.id, score)
    }catch(err){
      setError(err.response?.data?.message || 'Failed')
    }finally{ setLoading(false) }
  }

  return (
    <article className="store-card card">
      <div className="store-header">
        <div>
          <h3>{store.name}</h3>
          <p className="muted">{store.address}</p>
        </div>
        <div className="rating-block">
          <div className="avg">{store.averageRating ?? '—'}</div>
          <div className="muted">Avg</div>
        </div>
      </div>

      <div className="store-actions">
        <div className="your-rating">
          <small>Your rating</small>
          <Stars value={rating} onChange={(v)=>submitRating(v)} />
          {loading && <small className="muted">Saving...</small>}
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </article>
  )
}
