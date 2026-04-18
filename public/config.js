// public/config.js
// API Base URL Configuration
// Set your Railway URL below for production
defineAPIBase();

function defineAPIBase() {
  window.API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://your-railway-app.up.railway.app'; // <-- CHANGE THIS to your real Railway URL
}

function getToken() {
  return localStorage.getItem('alifToken');
}

function setToken(token) {
  localStorage.setItem('alifToken', token);
}

function clearToken() {
  localStorage.removeItem('alifToken');
}

// Fetch helper with API_BASE
async function apiFetch(endpoint, options = {}) {
  const url = `${window.API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let error = 'Unknown error';
    try { error = (await response.json()).error || error; } catch {}
    throw new Error(error);
  }
  return response.json();
}
