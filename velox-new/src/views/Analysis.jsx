import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { UNIVERSE, CHART_DATA } from '../data/market';

function scoreColor(s) {
  return s >= 85 ? 'var(--teal)' : s >= 65 ? 'var(--amber)' : 'var(--red)';
}

const DETAIL_SCORES = {
  GEV:  { trend:94, momentum:90, volume:97, sector:88, structure:92 },
  NVDA: { trend:95, momentum:88, volume:90, sector:95, structure:87 },
  AXON: { trend:90, momentum:82, volume:94, sector:88, structure:85 },
  META: { trend:92, momentum:84, volume:78, sector:95, structure:83 },
  VIST: { trend:86, momentum:82, volume:88, sector:42, structure:84 },
  CRWD: { trend:88, momentum:80, volume:80, sector:95, structure:76 },
  WM:   { trend:82, momentum:68, volume:70, sector:88, structure:75 },
  CELH: { trend:72, momentum:60, volume:65, sector:55, structure:80 },
  GILD: { trend:78, momentum:64, volume:62, sector:84, structure:74 },
  LULU: { trend:80, momentum:62, volume:68, sector:55, structure:78 },
  XOM:  { trend:62, momentum:52, volume:48, sector:42, structure:60 },
  NEE:  { trend:40, momentum:44, volume:42, sector:38, structure:46 },
  O:    { trend:44, momentum:46, volume:40, sector:40, structure:50 },
  KO:   { trend:42, momentum:48, volume:44, sector:36, structure:48 },
  ABBV: { trend:70, momentum:58, volume:62, sector:78, structure:66 },
};

const REASONS = {
  GEV:  'Breaking 52-wk high on 2.4× volume. Strongest RS in screen. Earnings revisions trending positive last 3 quarters.',
  NVDA: 'Clean breakout above 8-week base on 1.8× volume. Sector RS rank #1. ATR entry triggers above $139.',
  AXON: 'Gap-and-go above 6-week consolidation. Earnings beat last Q (+12% surprise). Volume 2.1× avg.',
  META: 'Breakout from 8-week flat base. RS vs SPY strong at +36% 3-month. Sector tailwind Technology.',
  VIST: 'Top RS in Energy despite weak sector. High EPS growth. Idiosyncratic strength on high volume.',
  CRWD: 'Healthy pullback to 21-day MA. Still in strong uptrend. Re-entry zone forming — watch for reclaim.',
  WM:   'Steady compounder in top sector. Low-volatility base. Good risk/reward with tight stop.',
  CELH: 'Tight 30-day base forming above 50MA. High EPS growth catalyst. Waiting on volume expansion.',
  GILD: 'Consolidating above all key MAs. Low EPS growth but sector tailwind strong.',
  LULU: 'Orderly pullback to 21-day MA. Sector RS weakening — watch for sector rotation confirmation.',
  XOM:  'Sector RS weak. Volume sub-threshold. Monitor for sector rotation before adding exposure.',
  NEE:  'Below key MAs. Sector underperforming. Avoid until structure improves.',
  O:    'Weak trend structure. REIT sector under pressure. Not a screener candidate.',
  KO:   'Defensive sector with negative RS. No momentum. Pass.',
  ABBV: 'Basing above 50MA. Health Care sector strength. Low EPS growth limits conviction.',
};

function RadarRow({ label, val }) {
  const col = val >= 85 ? 'var(--teal)' : val >= 65 ? 'var(--amber)' : 'var(--red)';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
      <span style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--text3)', width:80 }}>{label}</span>
      <div style={{ flex:1, height:5, background:'var(--bg3)', borderRadius:3, overflow:'hidden' }}>
        <div style={{ width:`${val}%`, height:'100%', background:col, borderRadius:3, transition:'width 0.4s' }} />
      </div>
      <span style={{ fontFamily:'var(--mono)', fontSize:11, color:col, width:24, textAlign:'right' }}>{val}</span>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border2)',
      borderRadius:'var(--radius)', padding:'6px 10px',
      fontFamily:'var(--mono)', fontSize:11,
    }}>
      <div style={{ color:'var(--text)' }}>${payload[0]?.value?.toFixed(2)}</div>
    </div>
  );
};

export default function Analysis({ selectedTicker }) {
  const [ticker, setTicker] = useState(selectedTicker || 'NVDA');
  const stock = UNIVERSE.find(s => s.ticker === ticker) || UNIVERSE[0];
  const chartData = CHART_DATA[ticker] || CHART_DATA.DEFAULT;
  const dims = DETAIL_SCORES[ticker] || { trend:70, momentum:65, volume:68, sector:72, structure:70 };
  const reason = REASONS[ticker] || 'Setup analysis pending.';
  const sc = scoreColor(stock.score);

  const dimLabels = [
    { key:'trend',     label:'Trend' },
    { key:'momentum',  label:'Momentum' },
    { key:'volume',    label:'Volume' },
    { key:'sector',    label:'Sector RS' },
    { key:'structure', label:'Structure' },
  ];

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      {/* Left: ticker picker */}
      <div style={{
        width:180, flexShrink:0, borderRight:'1px solid var(--border)',
        background:'var(--bg2)', overflow:'auto',
      }}>
        <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)', letterSpacing:'0.12em' }}>SELECT STOCK</span>
        </div>
        {UNIVERSE.map(s => {
          const sc2 = scoreColor(s.score);
          const active = s.ticker === ticker;
          return (
            <div key={s.ticker} onClick={()=>setTicker(s.ticker)} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'9px 14px', cursor:'pointer',
              borderBottom:'1px solid var(--border)',
              background: active ? 'rgba(239,159,39,0.07)' : 'transparent',
              borderLeft: active ? '2px solid var(--amber)' : '2px solid transparent',
              transition:'all 0.1s',
            }}>
              <span style={{ fontFamily:'var(--mono)', fontWeight:active?600:400, fontSize:12, color:active?'var(--amber)':'var(--text)' }}>{s.ticker}</span>
              <span style={{ fontFamily:'var(--mono)', fontSize:11, color:sc2, fontWeight:500 }}>{s.score}</span>
            </div>
          );
        })}
      </div>

      {/* Main */}
      <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
        {/* Stock header */}
        <div style={{
          padding:'14px 20px', borderBottom:'1px solid var(--border)',
          background:'var(--bg2)', flexShrink:0,
          display:'flex', alignItems:'center', gap:20,
        }}>
          <div>
            <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
              <span style={{ fontFamily:'var(--mono)', fontWeight:600, fontSize:20 }}>{stock.ticker}</span>
              <span style={{ fontSize:13, color:'var(--text2)' }}>{stock.name}</span>
            </div>
            <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>{stock.sector}</div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:16 }}>
            {[
              {l:'Price', v:`$${stock.price}`},
              {l:'RSI', v:stock.rsi},
              {l:'R.Vol', v:`${stock.rvol}×`},
              {l:'RS 3M', v:`+${stock.rs3m}%`, c:'var(--teal)'},
              {l:'Setup', v:stock.setup},
            ].map(d=>(
              <div key={d.l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)', marginBottom:2 }}>{d.l}</div>
                <div style={{ fontFamily:'var(--mono)', fontSize:13, fontWeight:500, color:d.c||'var(--text)' }}>{d.v}</div>
              </div>
            ))}
            <div style={{ textAlign:'center', paddingLeft:16, borderLeft:'1px solid var(--border)' }}>
              <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)', marginBottom:2 }}>SCORE</div>
              <div style={{ fontFamily:'var(--mono)', fontSize:20, fontWeight:600, color:sc }}>{stock.score}</div>
            </div>
          </div>
        </div>

        <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 280px', gap:0, overflow:'hidden' }}>
          {/* Chart */}
          <div style={{ padding:20, borderRight:'1px solid var(--border)', overflow:'auto' }}>
            <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:12 }}>
              PRICE CHART · 90 DAYS
            </div>
            <div style={{ height:220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{top:4,right:4,bottom:0,left:0}}>
                  <XAxis dataKey="day" hide />
                  <YAxis domain={['auto','auto']} hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone" dataKey="price" stroke="var(--amber)"
                    strokeWidth={1.5} dot={false} activeDot={{r:3, fill:'var(--amber)'}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* MA table */}
            <div style={{ marginTop:16 }}>
              <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:8 }}>MOVING AVERAGE STRUCTURE</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                {[
                  {l:'vs 20 MA', v:stock.vs20},
                  {l:'vs 50 MA', v:stock.vs50},
                  {l:'vs 200 MA', v:stock.vs200},
                ].map(d=>(
                  <div key={d.l} style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'8px 12px' }}>
                    <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)', marginBottom:4 }}>{d.l}</div>
                    <div style={{ fontFamily:'var(--mono)', fontSize:15, fontWeight:500, color:d.v>=0?'var(--teal)':'var(--red)' }}>
                      {d.v>=0?'+':''}{d.v}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div style={{ marginTop:16, padding:'12px 14px', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'var(--radius)', borderLeft:'2px solid var(--amber)' }}>
              <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:6 }}>SETUP RATIONALE</div>
              <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.6, fontFamily:'var(--mono)' }}>{reason}</div>
            </div>
          </div>

          {/* Right: Score breakdown */}
          <div style={{ padding:20, overflow:'auto' }}>
            <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:16 }}>COMPOSITE SCORE</div>
            
            {/* Big score */}
            <div style={{ textAlign:'center', marginBottom:20 }}>
              <div style={{
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                width:72, height:72, borderRadius:'50%',
                border:`2px solid ${sc}`,
                background:`${sc}18`,
              }}>
                <span style={{ fontFamily:'var(--mono)', fontSize:24, fontWeight:600, color:sc }}>{stock.score}</span>
              </div>
              <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--text3)', marginTop:6 }}>
                {stock.score>=85?'STRONG SETUP':stock.score>=65?'WATCHLIST':'AVOID'}
              </div>
            </div>

            {/* Radar bars */}
            {dimLabels.map(d => (
              <RadarRow key={d.key} label={d.label} val={dims[d.key]} />
            ))}

            {/* Stats grid */}
            <div style={{ marginTop:20 }}>
              <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text3)', letterSpacing:'0.1em', marginBottom:10 }}>KEY METRICS</div>
              {[
                {l:'Mkt Cap', v:stock.mcap},
                {l:'Avg Vol', v:stock.vol},
                {l:'ADR', v:`${stock.adr}%`},
                {l:'EPS Growth', v:`+${stock.eps}%`},
              ].map(d=>(
                <div key={d.l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontSize:11, color:'var(--text3)' }}>{d.l}</span>
                  <span style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--text)' }}>{d.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
