import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { fetchRegime, fetchSectors } from '../api';
import { UNIVERSE } from '../data/market';

function ScoreBar({ score }) {
  const color = score >= 85 ? 'var(--teal)' : score >= 65 ? 'var(--amber)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 52, height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color, minWidth: 24 }}>{score}</span>
    </div>
  );
}

function RegimeBar({ regime, loading }) {
  const bull = regime?.trend === 'BULL';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 20,
      padding: '10px 20px', background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)', flexShrink: 0,
    }}>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Loader size={13} color="var(--text3)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>LOADING LIVE REGIME...</span>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {bull ? <CheckCircle size={14} color="var(--teal)" /> : <AlertTriangle size={14} color="var(--red)" />}
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: bull ? 'var(--teal)' : 'var(--red)', fontWeight: 600 }}>
              MARKET REGIME: {regime?.label?.toUpperCase()}
            </span>
          </div>
          {[
            { label: 'SPY',   val: regime?.spyPrice },
            { label: '200MA', val: regime?.spy200ma },
            { label: 'GAP',   val: regime?.spyPrice && regime?.spy200ma ? `+${((regime.spyPrice / regime.spy200ma - 1) * 100).toFixed(1)}%` : '-' },
            { label: 'VIX',   val: regime?.vix },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em' }}>{item.label}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text)', fontWeight: 500 }}>{item.val}</span>
            </div>
          ))}
        </>
      )}
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

function SectorHeatmap({ sectors, loading }) {
  const displaySectors = loading || !sectors?.length
    ? [
        { sector: 'Technology', rs: 0 }, { sector: 'Industrials', rs: 0 },
        { sector: 'Health Care', rs: 0 }, { sector: 'Financials', rs: 0 },
        { sector: 'Cons. Disc.', rs: 0 }, { sector: 'Materials', rs: 0 },
        { sector: 'Energy', rs: 0 }, { sector: 'Utilities', rs: 0 },
        { sector: 'Real Estate', rs: 0 }, { sector: 'Cons. Staples', rs: 0 },
      ]
    : sectors;

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.1em' }}>
          SECTOR RELATIVE STRENGTH {loading ? '· LOADING...' : '· LIVE'}
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)' }}>3-MONTH vs SPY</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
        {displaySectors.slice(0, 10).map((s, i) => {
          const rs = s.rs || 0;
          const intensity = Math.abs(rs) / 40;
          const bg = loading ? 'var(--bg3)'
            : rs > 15 ? `rgba(29,158,117,${0.15 + intensity * 0.5})`
            : rs > 0  ? `rgba(239,159,39,${0.1 + intensity * 0.3})`
            : `rgba(226,75,74,${0.1 + intensity * 0.4})`;
          const col = loading ? 'var(--text3)'
            : rs > 15 ? 'var(--teal)' : rs > 0 ? 'var(--amber)' : 'var(--red)';
          const isTop = !loading && sectors && i < 3;
          return (
            <div key={s.sector} style={{
              background: bg, border: `1px solid ${col}33`,
              borderRadius: 'var(--radius)', padding: '8px 10px', position: 'relative',
            }}>
              {isTop && <div style={{ position: 'absolute', top: 4, right: 6, width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)' }} />}
              <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 3, lineHeight: 1.2 }}>{s.sector}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: col }}>
                {loading ? '···' : `${rs > 0 ? '+' : ''}${rs}%`}
              </div>
            </div>
          );
        })}
      </div>
      {!loading && <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)' }}>TOP SECTOR — SCREENER PRIORITY</span>
      </div>}
    </div>
  );
}

function RankedOpportunities({ onSelectStock }) {
  const top = [...UNIVERSE].sort((a, b) => b.score - a.score).slice(0, 10);
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.1em' }}>RANKED OPPORTUNITIES</span>
      </div>
      {top.map((s, i) => (
        <div key={s.ticker} onClick={() => onSelectStock(s.ticker)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 16px', borderBottom: i < top.length - 1 ? '1px solid var(--border)' : 'none',
          cursor: 'pointer', transition: 'background 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', minWidth: 16 }}>{i + 1}</span>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 13 }}>{s.ticker}</span>
            <span style={{ fontSize: 10, color: 'var(--text3)' }}>{s.sector}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>${s.price}</span>
            <span style={{
              fontSize: 9, fontFamily: 'var(--mono)', padding: '2px 7px', borderRadius: 10,
              background: s.setup === 'Breakout' ? 'var(--amber-bg)' : s.setup === 'Pullback' ? 'var(--red-bg)' : 'var(--bg3)',
              color: s.setup === 'Breakout' ? 'var(--amber)' : s.setup === 'Pullback' ? 'var(--red)' : 'var(--text2)',
            }}>{s.setup}</span>
            <ScoreBar score={s.score} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendingStocks({ onSelectStock }) {
  const sorted = [...UNIVERSE].sort((a, b) => Math.abs(b.chg) - Math.abs(a.chg)).slice(0, 6);
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.1em' }}>TRENDING</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {sorted.map((s, i) => (
          <div key={s.ticker} onClick={() => onSelectStock(s.ticker)} style={{
            padding: '10px 16px',
            borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
            borderBottom: i < sorted.length - 2 ? '1px solid var(--border)' : 'none',
            cursor: 'pointer', transition: 'background 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 13 }}>{s.ticker}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: s.chg >= 0 ? 'var(--teal)' : 'var(--red)' }}>
                {s.chg >= 0 ? '+' : ''}{s.chg}%
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>${s.price} · {s.sector}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ onSelectStock }) {
  const [regime, setRegime]   = useState(null);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [r, s] = await Promise.all([fetchRegime(), fetchSectors()]);
        setRegime(r);
        setSectors(s.sectors || []);
      } catch (e) {
        console.error('API error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <RegimeBar regime={regime} loading={loading} />
      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignContent: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectorHeatmap sectors={sectors} loading={loading} />
          <TrendingStocks onSelectStock={onSelectStock} />
        </div>
        <RankedOpportunities onSelectStock={onSelectStock} />
      </div>
    </div>
  );
}
