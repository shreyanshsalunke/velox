const BASE = 'https://web-production-410a6c.up.railway.app';

export async function fetchRegime() {
  const r = await fetch(`${BASE}/api/regime`);
  return r.json();
}

export async function fetchSectors() {
  const r = await fetch(`${BASE}/api/sectors`);
  return r.json();
}

export async function fetchTicker(symbol) {
  const r = await fetch(`${BASE}/api/ticker/${symbol}`);
  return r.json();
}

export async function quickScreen(params = {}) {
  const q = new URLSearchParams(params).toString();
  const r = await fetch(`${BASE}/api/screen/quick?${q}`);
  return r.json();
}

export async function startScreen(filters) {
  const r = await fetch(`${BASE}/api/screen/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  });
  return r.json();
}

export async function pollScreen(jobId) {
  const r = await fetch(`${BASE}/api/screen/status/${jobId}`);
  return r.json();
}

export async function fetchMomentum(period = '1M') {
  const r = await fetch(`${BASE}/api/momentum?period=${period}`);
  return r.json();
}
