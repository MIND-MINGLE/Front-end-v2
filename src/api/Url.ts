const baseUrl = import.meta.env.VITE_MINDMINGLE_BASE_URL_API
const signalRBaseURL = import.meta.env.VITE_MINDMINGLE_SIGNALR_URL_API
const localhostUrl = "https://localhost:7250";

const getJwtToken = () => {
  const token = sessionStorage.getItem("token")
  return token
}

const headers = {
  "Content-Type": "application/json",
  // Add headers such as Authorization if required
   'Authorization': getJwtToken(),
   "ngrok-skip-browser-warning":"69420blazing"
};


export { headers, baseUrl, localhostUrl,signalRBaseURL, getJwtToken };
