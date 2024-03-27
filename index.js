const express = require("express");
const corsMiddleware = require("./middleware/cors_middleware");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(corsMiddleware); // Uncomment if needed
app.use(bodyParser.json());

// Example route
app.get("/", (req, res) => res.send("Express on Vercel"));

// Example route with /api prefix
app.use("/api", routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
