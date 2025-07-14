export function login(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

export function logout() {
    localStorage.removeItem("user");
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
}
