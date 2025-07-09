import { Router } from "express";

const router = Router();

router.get("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Reset Password</title>
</head>
<body>
  <h1>Reset Password</h1>
  <form id="resetForm">
    <input type="password" id="password" placeholder="New password" required />
    <button type="submit">Submit</button>
  </form>
  <div id="message"></div>
  <script>
    const form = document.getElementById('resetForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;
      const res = await fetch('/api/reset-password/${token}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: password })
      });
      const data = await res.json();
      document.getElementById('message').innerText = data.message || 'Error';
    });
  </script>
</body>
</html>`;
  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
