const API_BASE_URL = 'http://localhost:5000/api';

// 1. SOS APIs
export const fetchSOSAlerts = async () => {
  const res = await fetch(`${API_BASE_URL}/sos`);
  return res.json();
};

export const createSOSAlert = async (sosData) => {
  const res = await fetch(`${API_BASE_URL}/sos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sosData)
  });
  return res.json();
};

// 2. Safe Status APIs
export const fetchSafeStatuses = async () => {
  const res = await fetch(`${API_BASE_URL}/safe-status`);
  return res.json();
};

export const createSafeStatus = async (safeData) => {
  const res = await fetch(`${API_BASE_URL}/safe-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(safeData)
  });
  return res.json();
};

// 3. Supplies APIs
export const fetchSupplies = async () => {
  const res = await fetch(`${API_BASE_URL}/supplies`);
  return res.json();
};

// 4. AI Detection APIs
export const fetchAIDetections = async () => {
  const res = await fetch(`${API_BASE_URL}/ai-detect`);
  return res.json();
};