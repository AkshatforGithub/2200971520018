import React from "react";
import UrlShortener from "./components/UrlShortener.jsx";

const App = () => <UrlShortener />;


window.fetch = async (url, options) => {
  if (url === "/api/shorten") {
    const requestBody = JSON.parse(options.body);

    const { validity = 30, shortcode = "default123" } = requestBody;

    return {
      ok: true,
      json: async () => ({
        shortenedUrl: `http://localhost:3000/${shortcode}`,
        validity,
      }),
    };
  }

  return fetch(url, options); // fallback to real fetch
};



export default App;


