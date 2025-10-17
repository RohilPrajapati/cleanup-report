export function getAuthHeader() {
  const accessToken = localStorage.getItem("access_token");
  console.log("Auth Header:", accessToken);

  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` };
  } else {
    return {};
  }
}

export function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("auth");
}


export const isAuthenticated = () => {
    return localStorage.getItem("auth") === "true";
};

