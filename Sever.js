const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/history', (req, res) => {
    console.log(`[HISTORY] ${new Date(req.body.time).toLocaleString()} - ${req.body.url}`);
    res.json({ success: true });
});

app.post('/api/bookmark', (req, res) => {
    console.log(`[BOOKMARK] ${req.body.title} - ${req.body.url}`);
    res.json({ success: true });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Chrome Web chạy tại http://localhost:${PORT}`);
});
