const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDb = require("./config/db.config");
connectDb();
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const nocache = (req, resp, next) => {
  resp.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  resp.header("Expires", "-1");
  resp.header("Pragma", "no-cache");
  next();
};
app.use(nocache);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/sessions", require("./routes/sessions.routes"));
app.get("/ping", (req, res) => res.json({ message: "server is fine" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
