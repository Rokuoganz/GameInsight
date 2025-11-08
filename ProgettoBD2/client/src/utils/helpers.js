const API_URL = "http://localhost:5000/api/sessions"; // Cambia porta se serve

export const getSessions = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const createSession = async (sessionData) => {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionData)
  });
};

export const deleteSession = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
};
