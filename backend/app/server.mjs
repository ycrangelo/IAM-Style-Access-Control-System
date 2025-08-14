import app from './app.mjs'

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("testing");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});