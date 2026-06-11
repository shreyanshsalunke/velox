import { useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { UNIVERSE, MARKET_REGIME } from '../data/market';

const SECTOR_LIST = ['Technology','Industrials','Health Care','Financials','Cons. Disc.','Materials','Energy','Utilities','Real Estate','Cons. Staples'];
const TOP_SECTORS = new Set(['Technology','Industrials','Health Care']);

function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width: 32, height: 18, borderRadius: 9, cursor: 'pointer',
      background: checked ? 'var(--teal)' : 'var(--bg3)',
      border: `1px solid ${checked ? 'var(--teal2)' : 'var(--border2)'}`,
      position: 'relative', transition: 'all 0.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2, left: checked ? 14 : 2,
        width: 12, height: 12, borderRadius: '50%',
        background: 'white', transition: 'left 0.2s',
      }} />
    </div>
  );
}

function scoreColor(s) {
  return s >= 85 ? 'var(--teal)' : s >= 65 ? 'var(--amber)' : 'var(--red)';
}

export default function Screener({ onSelectStock }) {
  const [filters, setFilters] = useState({
    trend: true, rsi: true, rvol: true, base: false, eps: false,
    minRsi: 50, minMcap: 0, minVol: 1,
  });
  const [activeSectors, setActiveSectors] = useState(new Set(TOP_SECTORS));
  const [results, setResults] = useState([]);
  const [ran, setRan] = useState(false);
  const [running, setRunning] = useState(false);
  const [sortKey, setSortKey] = useState('score');
  const [selected, setSelected] = useState(null);

  const mcapLabels = ['$300M','$500M','$1B','$2B','$5B+'];
  const volLabels  = ['100K','500K','1M','5M+'];

  function toggleSector(s) {
    setActiveSectors(prev => {
      const n = new Set(prev);
      n.has(s) ? n.delete(s) : n.add(s);
      return n;
    });
  }

  function runScreen() {
    setRunning(true);
    setTimeout(() => {
      let r = UNIVERSE.filter(s => {
        if (activeSectors.size > 0 && !activeSectors.has(s.sector)) return false;
        if (filters.trend && (s.vs20 < 0 || s.vs50 < 0)) return false;
        if (filters.rsi && s.rsi < filters.minRsi) return false;
        if (filters.rvol && s.rvol < 1.0) return false;
        if (filters.base && !['Breakout','Basing'].includes(s.setup)) return false;
        if (filters.eps && s.eps < 25) return false;
        return true;
      });
      r.sort((a,b) => b[sortKey] - a[sortKey]);
      setResults(r);
      setRan(true);
      setRunning(false);
    }, 700);
  }

  function handleSort(key) {
    setSortKey(key);
    setResults(prev => [...prev].sort((a,b) => b[key] - a[key]));
  }

  const selectedData = selected ? UNIVERSE.find(s => s.ticker === selected) : null;

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0, borderRight: '1px solid var(--border)',
        background: 'var(--bg2)', padding: 16, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* Active Filters */}
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: '0.12em', marginBottom: 10 }}>FILTERS</div>
          {[
            { key:'trend', label:'Trend (20/50/200 MA)' },
            { key:'rsi',   label:'Momentum (RSI)' },
            { key:'rvol',  label:'Rel. volume ≥ 1×' },
            { key:'base',  label:'Base/Breakout only' },
            { key:'eps',   label:'EPS growth > 25%' },
          ].map(f => (
            <div key={f.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--text2)' }}>{f.label}</span>
              <Toggle checked={filters[f.key]} onChange={v => setFilters(p => ({...p, [f.key]: v}))} />
            </div>
          ))}
        </div>

        {/* Sliders */}
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: '0.12em', marginBottom: 10 }}>THRESHOLDS</div>
          {[
            { key:'minRsi', label:'Min RSI', min:40, max:70, fmt: v => v },
            { key:'minMcap', label:'Min Mkt Cap', min:0, max:4, fmt: v => mcapLabels[v] },
            { key:'minVol', label:'Min Avg Vol', min:0, max:3, fmt: v => volLabels[v] },
          ].map(s => (
            <div key={s.key} style={{ marginBottom: 12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize: 10, color: 'var(--text2)', marginBottom: 4 }}>
                <span>{s.label}</span>
                <span style={{ fontFamily:'var(--mono)', color:'var(--text)' }}>{s.fmt(filters[s.key])}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={1} value={filters[s.key]}
                onChange={e => setFilters(p => ({...p, [s.key]: +e.target.value}))}
                style={{ width: '100%', accentColor: 'var(--amber)' }}
              />
            </div>
          ))}
        </div>

        {/* Sectors */}
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: '0.12em', marginBottom: 10 }}>SECTORS</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap: 4 }}>
            {SECTOR_LIST.map(s => {
              const on = activeSectors.has(s);
              return (
                <button key={s} onClick={() => toggleSector(s)} style={{
                  fontSize: 9, fontFamily: 'var(--mono)', padding: '3px 8px', borderRadius: 20,
                  border: `1px solid ${on ? 'var(--teal2)' : 'var(--border)'}`,
                  background: on ? 'var(--teal-bg)' : 'transparent',
                  color: on ? 'var(--teal)' : 'var(--text3)',
                  transition: 'all 0.15s',
                }}>{s}</button>
              );
            })}
          </div>
        </div>

        <button onClick={runScreen} disabled={running} style={{
          marginTop: 'auto', display:'flex', alignItems:'center', justifyContent:'center', gap: 6,
          padding: '9px 0', borderRadius: 'var(--radius)',
          border: `1px solid ${running ? 'var(--amber2)' : 'var(--border2)'}`,
          background: running ? 'var(--amber-bg)' : 'var(--bg3)',
          color: running ? 'var(--amber)' : 'var(--text)',
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500,
          transition: 'all 0.15s',
        }}>
          {running ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={12} />}
          {running ? 'Scanning...' : ran ? 'Re-run Screen' : 'Run Screen'}
        </button>
      </div>

      {/* Results */}
      <div style={{ flex: 1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding: '10px 16px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg2)', flexShrink: 0,
        }}>
          <span style={{ fontFamily:'var(--mono)', fontSize: 11, color: 'var(--text2)' }}>
            {ran ? <><span style={{ color:'var(--amber)' }}>{results.length}</span> setups · {sortKey}</> : 'Press run to scan universe'}
          </span>
          <div style={{ display:'flex', gap: 4 }}>
            {['score','rsi','rvol','rs3m'].map(k => (
              <button key={k} onClick={() => handleSort(k)} style={{
                fontSize: 10, fontFamily:'var(--mono)', padding:'3px 10px', borderRadius: 20,
                border: `1px solid ${sortKey===k ? 'var(--amber2)' : 'var(--border)'}`,
                background: sortKey===k ? 'var(--amber-bg)' : 'transparent',
                color: sortKey===k ? 'var(--amber)' : 'var(--text3)',
              }}>{k.toUpperCase()}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {!ran ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap: 8, color: 'var(--text3)' }}>
              <Play size={28} strokeWidth={1} />
              <span style={{ fontFamily:'var(--mono)', fontSize: 12 }}>configure filters · run screen</span>
            </div>
          ) : results.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap: 8, color: 'var(--text3)' }}>
              <span style={{ fontFamily:'var(--mono)', fontSize: 12 }}>no setups pass current filters</span>
            </div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', position:'sticky', top: 0, background: 'var(--bg2)', zIndex: 1 }}>
                  {['#','Ticker','Sector','Price','vs 50MA','RSI','R.Vol','RS 3M','Setup','Score'].map(h => (
                    <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontFamily:'var(--mono)', fontSize: 9, color:'var(--text3)', letterSpacing:'0.1em', fontWeight:500, whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((s, i) => {
                  const sc = scoreColor(s.score);
                  const sel = selected === s.ticker;
                  return (
                    <tr key={s.ticker} onClick={() => setSelected(sel ? null : s.ticker)} style={{
                      borderBottom: '1px solid var(--border)',
                      background: sel ? 'rgba(239,159,39,0.06)' : 'transparent',
                      cursor:'pointer',
                    }}
                    onMouseEnter={e => { if(!sel) e.currentTarget.style.background = 'var(--bg3)'; }}
                    onMouseLeave={e => { if(!sel) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding:'9px 12px', fontFamily:'var(--mono)', fontSize:10, color:'var(--text3)' }}>{i+1}</td>
                      <td style={{ padding:'9px 12px', fontFamily:'var(--mono)', fontWeight:600, fontSize:13, color:'var(--text)' }}>{s.ticker}</td>
                      <td style={{ padding:'9px 12px' }}>
                        <span style={{ fontSize:9, fontFamily:'var(--mono)', padding:'2px 7px', borderRadius:10, background:'var(--bg3)', color:'var(--text3)', border:'1px solid var(--border)' }}>{s.sector}</span>
                      </td>
                      <td style={{ padding:'9px 12px', fontFamily:'var(--mono)', fontSize:12 }}>${s.price}</td>
                      <td style={{ padding:'9px 12px', fontFamily:'var(--mono)', fontSize:11, color: s.vs50>=0?'var(--teal)':'var(--red)' }}>{s.vs50>=0?'+':''}{s.vs50}%</td>
                      <td style={{ padding:'9px 12px', fontFamily:'var(--mono)', fontSize:11, color: s.rsi>60?'var(--teal)':'var(--text)' }}>{s.rsi}</td>
                      <td style={{ padding:'9px 12px', fontFamily:'var(--mono)', fontSize:11, color: s.rvol>=1.5?'var(--teal)':'var(--text)' }}>{s.rvol}×</td>
                      <td style={{ padding:'9px 12px', fontFamily:'var(--mono)', fontSize:11, color: s.rs3m>=20?'var(--teal)':s.rs3m<0?'var(--red)':'var(--text)' }}>{s.rs3m>=0?'+':''}{s.rs3m}%</td>
                      <td style={{ padding:'9px 12px' }}>
                        <span style={{
                          fontSize:9, fontFamily:'var(--mono)', padding:'2px 8px', borderRadius:10,
                          background: s.setup==='Breakout'?'var(--amber-bg)':s.setup==='Pullback'?'var(--red-bg)':'var(--bg3)',
                          color: s.setup==='Breakout'?'var(--amber)':s.setup==='Pullback'?'var(--red)':'var(--text3)',
                        }}>{s.setup}</span>
                      </td>
                      <td style={{ padding:'9px 12px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                          <div style={{ width:52, height:5, background:'var(--bg3)', borderRadius:3, overflow:'hidden' }}>
                            <div style={{ width:`${s.score}%`, height:'100%', background:sc, borderRadius:3 }} />
                          </div>
                          <span style={{ fontFamily:'var(--mono)', fontSize:11, color:sc, fontWeight:500 }}>{s.score}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Drawer */}
        {selectedData && (
          <div style={{
            borderTop: '1px solid var(--border)', background: 'var(--bg2)',
            padding: 16, flexShrink: 0,
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                <span style={{ fontFamily:'var(--mono)', fontWeight:600, fontSize:15 }}>{selectedData.ticker}</span>
                <span style={{ fontSize:11, color:'var(--text2)' }}>{selectedData.name}</span>
              </div>
              <button onClick={() => { onSelectStock(selectedData.ticker); }} style={{
                padding:'5px 14px', borderRadius:'var(--radius)', border:'1px solid var(--border2)',
                background:'transparent', color:'var(--text)', fontSize:11, fontFamily:'var(--mono)',
              }}>Open Analysis →</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap: 10 }}>
              {[
                {l:'SCORE', v:selectedData.score, c:scoreColor(selectedData.score)},
                {l:'PRICE', v:`$${selectedData.price}`},
                {l:'RSI', v:selectedData.rsi},
                {l:'R.VOL', v:`${selectedData.rvol}×`},
                {l:'vs 50MA', v:`+${selectedData.vs50}%`, c:'var(--teal)'},
                {l:'vs 200MA', v:`+${selectedData.vs200}%`, c:'var(--teal)'},
                {l:'RS 3M', v:`+${selectedData.rs3m}%`, c:'var(--teal)'},
                {l:'EPS GR', v:`+${selectedData.eps}%`},
              ].map(d => (
                <div key={d.l} style={{ background:'var(--bg3)', borderRadius:'var(--radius)', padding:'8px 10px' }}>
                  <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)', letterSpacing:'0.08em', marginBottom:4 }}>{d.l}</div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:15, fontWeight:500, color:d.c||'var(--text)' }}>{d.v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
