import { Activity, TrendingUp, Grid, Search, BarChart2, Zap } from 'lucide-react';

const VIEWS = [
  { id: 'dashboard',  label: 'Dashboard',   icon: Grid },
  { id: 'screener',   label: 'Screener',    icon: Search },
  { id: 'momentum',   label: 'Momentum',    icon: TrendingUp },
  { id: 'universe',   label: 'Universe',    icon: BarChart2 },
  { id: 'analysis',   label: 'Analysis',    icon: Activity },
];

export default function TopBar({ activeView, onViewChange, regime }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', height: 48,
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Zap size={16} color="var(--amber)" />
        <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 13, letterSpacing: '0.1em', color: 'var(--amber)' }}>
          VELOX
        </span>
      </div>

      <nav style={{ display: 'flex', gap: 2 }}>
        {VIEWS.map(v => {
          const Icon = v.icon;
          const active = activeView === v.id;
          return (
            <button key={v.id} onClick={() => onViewChange(v.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 'var(--radius)',
              border: 'none',
              background: active ? 'var(--amber-bg)' : 'transparent',
              color: active ? 'var(--amber)' : 'var(--text2)',
              fontSize: 12, fontWeight: active ? 500 : 400,
              transition: 'all 0.15s',
            }}>
              <Icon size={13} />
              {v.label}
            </button>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 20,
          background: regime?.trend === 'BULL' ? 'var(--teal-bg)' : 'var(--red-bg)',
          border: `1px solid ${regime?.trend === 'BULL' ? 'var(--teal2)' : 'var(--red)'}`,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: regime?.trend === 'BULL' ? 'var(--teal)' : 'var(--red)',
          }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: regime?.trend === 'BULL' ? 'var(--teal)' : 'var(--red)', letterSpacing: '0.06em' }}>
            SPY {regime?.spyPrice} · VIX {regime?.vix}
          </span>
        </div>
      </div>
    </div>
  );
}
