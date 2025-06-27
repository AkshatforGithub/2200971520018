

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import log from "../middleware/logMiddleware";

const UrlShortener = () => {
  const [urls, setUrls] = useState([{ url: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const handleAdd = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: "", validity: "", shortcode: "" }]);
    }
  };

  const handleShorten = async () => {
    for (let i = 0; i < urls.length; i++) {
      const { url, validity, shortcode } = urls[i];

      if (!/^https?:\/\/\S+\.\S+/.test(url)) {
        await log("frontend", "error", "component", `Invalid URL format: ${url}`);
        continue;
      }

      const validMinutes = validity ? parseInt(validity) : 30;

      const payload = {
        url,
        validity: validMinutes,
        shortcode,
      };

      await log("frontend", "info", "component", "Sending URL to backend");

      try {
        // mock backend response
        const res = await fetch("/api/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        setResults((prev) => [...prev, data]);

        await log("frontend", "info", "api", "Shorten API success");
      } catch (err) {
        await log("frontend", "error", "api", `Shorten API failed: ${err.message}`);
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          URL Shortener
        </Typography>

        {urls.map((item, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Original URL"
                fullWidth
                value={item.url}
                onChange={(e) => handleChange(index, "url", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Validity (min)"
                fullWidth
                type="number"
                value={item.validity}
                onChange={(e) => handleChange(index, "validity", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Preferred Shortcode"
                fullWidth
                value={item.shortcode}
                onChange={(e) => handleChange(index, "shortcode", e.target.value)}
              />
            </Grid>
          </Grid>
        ))}

        <Button variant="outlined" onClick={handleAdd} disabled={urls.length >= 5}>
          Add Another
        </Button>

        <Button variant="contained" sx={{ ml: 2 }} onClick={handleShorten}>
          Shorten URLs
        </Button>

        <Typography variant="h6" mt={3}>Results</Typography>
        {results.map((res, i) => (
          <Typography key={i}>
            {res.shortenedUrl} - Expires in {res.validity || 30} min
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

export default UrlShortener;
