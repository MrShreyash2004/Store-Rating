import React, { useEffect, useState } from 'react'
import api from '../api'
import StoreCard from '../components/StoreCard'

export default function StoreList(){
  const [stores, setStores] = useState([])
  const [qName, setQName] = useState('')
  const [qAddress, setQAddress] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ fetchStores() }, [])

  async function fetchStores(){
    setLoading(true)
    try{
      const res = await api.get('/stores', { params: { qName, qAddress } })
      setStores(res.data.data)
    }catch(err){ console.error(err) }
    setLoading(false)
  }

  function onRatingUpdated(storeId, score){
    setStores(prev => prev.map(s => s.id===storeId ? { ...s, userRating: score } : s))
  }

  return (
    <div>
      <div className="search-row card">
        <input placeholder="Search name..." value={qName} onChange={e=>setQName(e.target.value)} />
        <input placeholder="Search address..." value={qAddress} onChange={e=>setQAddress(e.target.value)} />
        <button className="btn" onClick={fetchStores}>Search</button>
      </div>

      <div className="stores-grid">
        {loading && <div className="muted">Loading stores...</div>}
        {!loading && stores.length===0 && <div className="muted">No stores found</div>}
        {stores.map(s => <StoreCard key={s.id} store={s} onRatingUpdated={onRatingUpdated} />)}
      </div>
    </div>
  )
}
