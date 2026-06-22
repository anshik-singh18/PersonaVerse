// ============================================================
//  src/api.js
//
//  Yeh file saari API calls ka central place hai.
//  Frontend ke har page se yahi functions call honge.
//
//  Backend URL ek jagah define hai — agar change karna ho
//  toh sirf yahan badalna hoga.
// ============================================================

// Backend ka base URL
const BASE_URL = "https://personaverse-backend.onrender.com/api";

// ── Helper: localStorage se token lo ──
// Login ke baad token yahan save hoga
const getToken = () => localStorage.getItem("token");

// ── Helper: Authorization header banao ──
const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ============================================================
//  AUTH APIs
// ============================================================

// Signup — naya account banao
export const signupAPI = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

// Login — existing account
export const loginAPI = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ============================================================
//  PERSONA APIs
// ============================================================

// Naya persona banao
export const createPersonaAPI = async (personaData) => {
  const res = await fetch(`${BASE_URL}/personas`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(personaData),
  });
  return res.json();
};

// Saare personas lo (logged in user ke)
export const getPersonasAPI = async () => {
  const res = await fetch(`${BASE_URL}/personas`, {
    method: "GET",
    headers: authHeader(),
  });
  return res.json();
};

// Ek specific persona lo
export const getPersonaAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/personas/${id}`, {
    method: "GET",
    headers: authHeader(),
  });
  return res.json();
};

// Persona update karo
export const updatePersonaAPI = async (id, personaData) => {
  const res = await fetch(`${BASE_URL}/personas/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(personaData),
  });
  return res.json();
};

// Persona delete karo
export const deletePersonaAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/personas/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
};

// ============================================================
//  CHAT APIs
// ============================================================

// Message bhejo aur AI reply lo
export const sendMessageAPI = async (personaId, message) => {
  const res = await fetch(`${BASE_URL}/chat/send`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ personaId, message }),
  });
  return res.json();
};

// Ek persona ke saath chat history lo
export const getChatAPI = async (personaId) => {
  const res = await fetch(`${BASE_URL}/chat/${personaId}`, {
    method: "GET",
    headers: authHeader(),
  });
  return res.json();
};

// Saari recent chats lo (dashboard ke liye)
export const getAllChatsAPI = async () => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "GET",
    headers: authHeader(),
  });
  return res.json();
};