export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function logout() {
  localStorage.removeItem("user");
}
