import { useState } from 'react';
import { MOMENTUM_LEADERS } from '../data/market';

const PERIODS = ['1W','1M','3M','6M','YTD'];

function scoreColor(s) {
  return s >= 85 ? 'var(--teal)' : s >= 65 ? 'var(--amber)' : 'var(--red)';
}

const SECTOR_COLORS = {
  'Technology':   'var(--blue)',
  'Industrials':  'var(--amber)',
  'Health Care':  'var(--teal)',
  'Energy':       'var(--red)',
  'Cons. Disc.':  '#9B7DE8',
  'Financials':   '#5B9BD5',
};

export default function MomentumLeaders({ onSelectStock }) {
  const [period, setPeriod] = useState('1M');
  const data = MOMENTUM_LEADERS[period];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      {/* Header */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'12px 20px', borderBottom:'1px solid var(--border)',
        background:'var(--bg2)', flexShrink: 0,
      }}>
        <span style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--text2)', letterSpacing:'0.1em' }}>MOMENTUM LEADERS</span>
        <div style={{ display:'flex', gap: 3 }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding:'5px 14px', borderRadius:'var(--radius)', border:'none',
              background: period===p ? 'var(--amber-bg)' : 'transparent',
              color: period===p ? 'var(--amber)' : 'var(--text3)',
              fontFamily:'var(--mono)', fontSize:11, fontWeight: period===p ? 500 : 400,
              transition:'all 0.15s',
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex:1, overflow:'auto', padding: 20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 12 }}>
          {data.map((s, i) => {
            const sc = scoreColor(s.score);
            const sectorColor = SECTOR_COLORS[s.sector] || 'var(--text2)';
            return (
              <div key={s.ticker} onClick={() => onSelectStock(s.ticker)} style={{
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:'var(--radius-lg)', padding: 16, cursor:'pointer',
                transition:'all 0.15s', position:'relative', overflow:'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg3)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)'; }}
              >
                {/* Rank badge */}
                <div style={{
                  position:'absolute', top: 12, right: 12,
                  fontFamily:'var(--mono)', fontSize:10, color:'var(--text3)',
                }}>#{i+1}</div>

                <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontFamily:'var(--mono)', fontWeight:600, fontSize:16 }}>{s.ticker}</span>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize:9, fontFamily:'var(--mono)', padding:'2px 8px', borderRadius:10,
                    background:'var(--bg3)', color:sectorColor, border:`1px solid ${sectorColor}44`
                  }}>{s.sector}</span>
                </div>

                <div style={{ fontFamily:'var(--mono)', fontSize:22, fontWeight:600, color: s.chg>=0?'var(--teal)':'var(--red)', marginBottom:8 }}>
                  {s.chg>=0?'+':''}{s.chg}%
                </div>

                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <div style={{ flex:1, height:4, background:'var(--bg3)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ width:`${s.score}%`, height:'100%', background:sc, borderRadius:2 }} />
                  </div>
                  <span style={{ fontFamily:'var(--mono)', fontSize:11, color:sc, fontWeight:500 }}>{s.score}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Period context */}
        <div style={{ marginTop: 24, padding:'14px 16px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)' }}>
          <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:8 }}>
            {period} PERIOD SUMMARY
          </div>
          <div style={{ display:'flex', gap: 40 }}>
            <div>
              <div style={{ fontSize:11, color:'var(--text3)', marginBottom:2 }}>Top performer</div>
              <span style={{ fontFamily:'var(--mono)', fontWeight:600, fontSize:14 }}>{data[0]?.ticker}</span>
              <span style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--teal)', marginLeft:8 }}>+{data[0]?.chg}%</span>
            </div>
            <div>
              <div style={{ fontSize:11, color:'var(--text3)', marginBottom:2 }}>Avg gain (top 8)</div>
              <span style={{ fontFamily:'var(--mono)', fontWeight:600, fontSize:14, color:'var(--teal)' }}>
                +{(data.reduce((s,d)=>s+d.chg,0)/data.length).toFixed(1)}%
              </span>
            </div>
            <div>
              <div style={{ fontSize:11, color:'var(--text3)', marginBottom:2 }}>Top sector</div>
              <span style={{ fontFamily:'var(--mono)', fontWeight:600, fontSize:14 }}>
                {(() => {
                  const counts = {};
                  data.forEach(d => counts[d.sector] = (counts[d.sector]||0)+1);
                  return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0];
                })()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
