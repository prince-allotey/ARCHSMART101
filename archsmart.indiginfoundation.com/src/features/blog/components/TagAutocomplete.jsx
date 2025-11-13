import React, {useState, useEffect, useRef} from 'react'
import axios from '../../../api/axios'

export default function TagAutocomplete({value, onChange}){
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(()=>{
    if(!query) return setSuggestions([])
    const t = setTimeout(()=>{
      axios.get('/tags', { params: { q: query } }).then(r=>{
        setSuggestions(r.data || [])
        setOpen(true)
      }).catch(()=>{
        setSuggestions([])
      })
    }, 250)
    return ()=> clearTimeout(t)
  }, [query])

  useEffect(()=>{
    function onDoc(e){ if(ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onDoc)
    return ()=> document.removeEventListener('click', onDoc)
  }, [])

  function addTag(tag){
    if(!value.includes(tag)) onChange([...value, tag])
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={ref} style={{position:'relative'}}>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {value.map(t => (
          <button key={t} type="button" onClick={()=> onChange(value.filter(x=>x!==t))} className="tag-chip">{t} ×</button>
        ))}
      </div>
      <input
        className="input"
        value={query}
        onChange={e=> setQuery(e.target.value)}
        placeholder="Add tags..."
        onFocus={()=> query && setOpen(true)}
      />
      {open && suggestions.length>0 && (
        <div className="suggestion-box">
          {suggestions.map(s => (
            <div key={s} onClick={()=> addTag(s)} className="suggestion-item">{s}</div>
          ))}
        </div>
      )}
    </div>
  )
}
