import axios from "axios";
import Cookies from "js-cookie";

// //Request User Authorization
const clientId = "f93bfda7ee8e47569890f4812c3add02";
const clientSecert = "a5c801cbc1e44e84a6be3929948fe4d1";
const redirectUri = "http://localhost:3000/alphacast/";
const scope = "user-read-private user-read-email";
const authUrl = new URL("https://accounts.spotify.com/authorize");

// Code Verifier
const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};
const state = generateRandomString(8);

// params

export const getSpotifyAuth = async () => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state,
  });
  const spotifyLoginUrl = `${authUrl}?${params.toString()}`;
  window.location = spotifyLoginUrl;
};

export const getAccessToken = async (code) => {
  const url = "https://accounts.spotify.com/api/token";

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + btoa(`${clientId}:${clientSecert}`),
  };

  try {
    const { data } = await axios.post(url, params, { headers });
    Cookies.set("access_token", data.access_token);
    Cookies.set("refresh_token", data.refresh_token);
    return data.access_token;
  } catch (err) {
    console.log(`Get Access Token Failed ${err}`);
  }
};

export const getRefreshToken = async () => {
  const url = "https://accounts.spotify.com/api/token";
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", Cookies.get("refresh_token"));
  params.append("client_id", clientId);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + btoa(`${clientId}:${clientSecert}`),
  };

  try {
    const { data } = await axios.post(url, params, { headers });
    Cookies.set("access_token", data.access_token);
    Cookies.set("refrese_token", data.refresh_token);
  } catch (err) {
    console.log(`Get refresh token failed ${err}`);
  }
};

export const getProfile = async () => {
  try {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
    });
    console.log(data);
    return data;
  } catch (err) {
    console.log(`get profile failed ${err}`);
  }
};

export const searchItem = async (word) => {
  const url = `https://api.spotify.com/v1/search?q=${word}&type=show`;
  try {
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
    });
    console.log(data);
    return data;
  } catch (err) {
    console.log(`Search failed ${err}`);
  }
};
