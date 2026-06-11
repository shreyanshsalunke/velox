import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { UNIVERSE } from '../data/market';

const COLS = [
  { key:'ticker',  label:'Ticker',   mono:true,  bold:true  },
  { key:'sector',  label:'Sector',   tag:true              },
  { key:'price',   label:'Price',    mono:true,  prefix:'$' },
  { key:'chg',     label:'D%',       mono:true,  signed:true, pct:true },
  { key:'vs20',    label:'vs 20MA',  mono:true,  signed:true, pct:true },
  { key:'vs50',    label:'vs 50MA',  mono:true,  signed:true, pct:true },
  { key:'vs200',   label:'vs 200MA', mono:true,  signed:true, pct:true },
  { key:'rsi',     label:'RSI',      mono:true              },
  { key:'rvol',    label:'R.Vol',    mono:true,  suffix:'×' },
  { key:'rs3m',    label:'RS 3M',    mono:true,  signed:true, pct:true },
  { key:'mcap',    label:'Mkt Cap',  mono:true              },
  { key:'vol',     label:'Avg Vol',  mono:true              },
  { key:'eps',     label:'EPS Gr',   mono:true,  signed:true, pct:true },
  { key:'setup',   label:'Setup',    tag:true               },
  { key:'score',   label:'Score',    score:true             },
];

function scoreColor(s) {
  return s >= 85 ? 'var(--teal)' : s >= 65 ? 'var(--amber)' : 'var(--red)';
}

export default function Universe({ onSelectStock }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('score');
  const [sortDir, setSortDir] = useState('desc');

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const rows = useMemo(() => {
    let r = UNIVERSE.filter(s =>
      s.ticker.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.sector.toLowerCase().includes(search.toLowerCase())
    );
    r.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') return sortDir==='desc' ? bv.localeCompare(av) : av.localeCompare(bv);
      return sortDir==='desc' ? bv - av : av - bv;
    });
    return r;
  }, [search, sortKey, sortDir]);

  function cellContent(col, row) {
    const val = row[col.key];
    if (col.tag && col.key === 'sector') {
      return <span style={{ fontSize:9, fontFamily:'var(--mono)', padding:'2px 7px', borderRadius:10, background:'var(--bg3)', color:'var(--text3)', border:'1px solid var(--border)' }}>{val}</span>;
    }
    if (col.tag && col.key === 'setup') {
      const c = val==='Breakout'?'var(--amber)':val==='Pullback'?'var(--red)':val==='Weak'?'var(--red)':'var(--text3)';
      const bg = val==='Breakout'?'var(--amber-bg)':val==='Pullback'?'var(--red-bg)':val==='Weak'?'var(--red-bg)':'var(--bg3)';
      return <span style={{ fontSize:9, fontFamily:'var(--mono)', padding:'2px 8px', borderRadius:10, background:bg, color:c }}>{val}</span>;
    }
    if (col.score) {
      const sc = scoreColor(val);
      return (
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:44, height:4, background:'var(--bg3)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ width:`${val}%`, height:'100%', background:sc, borderRadius:2 }} />
          </div>
          <span style={{ fontFamily:'var(--mono)', fontSize:11, color:sc, fontWeight:500 }}>{val}</span>
        </div>
      );
    }
    let display = col.prefix ? col.prefix+val : val;
    if (col.suffix) display = val+col.suffix;
    if (col.signed && col.pct) display = (val>=0?'+':'')+val+'%';
    if (col.signed && !col.pct) display = (val>=0?'+':'')+val;
    const color = col.signed ? (val>0?'var(--teal)':val<0?'var(--red)':'var(--text2)') : undefined;
    return <span style={{ fontFamily:col.mono?'var(--mono)':undefined, fontWeight:col.bold?600:400, color, fontSize:12 }}>{display}</span>;
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      {/* Header bar */}
      <div style={{
        display:'flex', alignItems:'center', gap:12, padding:'10px 20px',
        borderBottom:'1px solid var(--border)', background:'var(--bg2)', flexShrink:0,
      }}>
        <span style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--text2)', letterSpacing:'0.1em' }}>UNIVERSE</span>
        <div style={{
          display:'flex', alignItems:'center', gap:8, flex:1, maxWidth:280,
          background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'var(--radius)',
          padding:'6px 10px',
        }}>
          <Search size={12} color="var(--text3)" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ticker, name, sector..."
            style={{ background:'transparent', border:'none', outline:'none', fontSize:11, color:'var(--text)', width:'100%' }}
          />
        </div>
        <span style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--text3)', marginLeft:'auto' }}>
          {rows.length} of {UNIVERSE.length} stocks
        </span>
      </div>

      {/* Table */}
      <div style={{ flex:1, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid var(--border)', position:'sticky', top:0, background:'var(--bg2)', zIndex:1 }}>
              {COLS.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)} style={{
                  padding:'8px 12px', textAlign:'left',
                  fontFamily:'var(--mono)', fontSize:9, color: sortKey===col.key?'var(--amber)':'var(--text3)',
                  letterSpacing:'0.1em', fontWeight:500, whiteSpace:'nowrap', cursor:'pointer',
                }}>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                    {col.label}
                    {sortKey===col.key && (sortDir==='desc' ? <ChevronDown size={10}/> : <ChevronUp size={10}/>)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.ticker} onClick={()=>onSelectStock(row.ticker)} style={{
                borderBottom:'1px solid var(--border)', cursor:'pointer', transition:'background 0.1s',
              }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                {COLS.map(col => (
                  <td key={col.key} style={{ padding:'9px 12px', whiteSpace:'nowrap' }}>
                    {cellContent(col, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ padding:'8px 20px', borderTop:'1px solid var(--border)', background:'var(--bg2)', flexShrink:0 }}>
        <span style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)' }}>
          {UNIVERSE.length} stocks active · click any row to open analysis
        </span>
      </div>
    </div>
  );
}
