import { useState } from "react";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:8080";

  const shortenUrl = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: longUrl }),
      });
      const data = await res.json();
      setShortCode(data.shortCode);
      setStats(data);
    } catch (err) {
      alert("Error! Make sure Spring Boot is running.");
    }
    setLoading(false);
  };

  const getStats = async () => {
    if (!shortCode) return;
    const res = await fetch(`${BASE_URL}/api/stats/${shortCode}`);
    const data = await res.json();
    setStats(data);
  };

  return (
      <div style={{ fontFamily: "Arial", maxWidth: "700px", margin: "50px auto", padding: "20px" }}>

        <h1 style={{ color: "#6366f1", textAlign: "center" }}>🔗 URL Shortener</h1>
        <p style={{ textAlign: "center", color: "#666" }}>Built with Spring Boot + Redis + PostgreSQL</p>

        <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "10px", marginTop: "30px" }}>
          <h3>Shorten a URL</h3>
          <input
              type="text"
              placeholder="Enter long URL here..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd", marginBottom: "10px", boxSizing: "border-box" }}
          />
          <button
              onClick={shortenUrl}
              disabled={loading || !longUrl}
              style={{ background: "#6366f1", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer", width: "100%" }}
          >
            {loading ? "Shortening..." : "Shorten URL ✂️"}
          </button>
        </div>

        {stats && (
            <div style={{ background: "#fff", border: "2px solid #6366f1", padding: "20px", borderRadius: "10px", marginTop: "20px" }}>
              <h3>✅ URL Shortened!</h3>
              <p><strong>Original:</strong> {stats.originalUrl}</p>
              <p><strong>Short Code:</strong>
                <span style={{ background: "#6366f1", color: "white", padding: "3px 10px", borderRadius: "5px", marginLeft: "10px" }}>
              {stats.shortCode}
            </span>
              </p>
              <p><strong>Short URL:</strong>
                <a href={`${BASE_URL}/${stats.shortCode}`} target="_blank" rel="noreferrer" style={{ marginLeft: "10px", color: "#6366f1" }}>
                  {BASE_URL}/{stats.shortCode}
                </a>
              </p>

              <div style={{ background: "#f0f0ff", padding: "15px", borderRadius: "8px", marginTop: "15px" }}>
                <h4>📊 Analytics</h4>
                <p style={{ fontSize: "32px", fontWeight: "bold", color: "#6366f1", margin: "5px 0" }}>
                  {stats.clickCount ?? 0}
                </p>
                <p style={{ color: "#666", margin: 0 }}>Total Clicks</p>
                <p style={{ color: "#888", fontSize: "12px" }}>
                  Created: {stats.createdAt ? new Date(stats.createdAt).toLocaleString() : "Just now"}
                </p>
                <button
                    onClick={getStats}
                    style={{ background: "#10b981", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}
                >
                  🔄 Refresh Stats
                </button>
              </div>
            </div>
        )}

        <p style={{ textAlign: "center", color: "#999", marginTop: "40px", fontSize: "12px" }}>
          Made by Shyam Dubey | github.com/shyameng45
        </p>
      </div>
  );
}

export default App;