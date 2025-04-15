const API_CLIENT_ID = import.meta.env.VITE_API_CLIENT_ID;
const API_CLIENT_SECRET = import.meta.env.VITE_API_CLIENT_SECRET;

export let wowApiToken = null;

export async function generateWowApiToken() {
  console.log("--- Generating token ---");
  const url = "https://oauth.battle.net/token";
  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(API_CLIENT_ID + ":" + API_CLIENT_SECRET),
    }),
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    throw new Error("Failed to generate token");
  }
  const data = await response.json();
  wowApiToken = data.access_token || wowApiToken;
}

// try {
//   generateWowApiToken();
// } catch (e) {
//   console.error("Error - generateToken", e);
// }
