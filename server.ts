import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const PORT = 3000;
const db = new Database('cms.db');

// Setup database
db.exec(`
  CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    image_url TEXT,
    video_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Insert default settings if not exist
const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
insertSetting.run('primaryColor', '#3b82f6'); // blue-500
insertSetting.run('secondaryColor', '#1d4ed8'); // blue-700
insertSetting.run('facebookUrl', 'https://facebook.com');
insertSetting.run('twitterUrl', 'https://twitter.com');
insertSetting.run('instagramUrl', 'https://instagram.com');
insertSetting.run('siteName', 'Mi CMS en Español');

// Setup uploads directory
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));

  // --- API Routes ---

  // Settings
  app.get('/api/settings', (req, res) => {
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = settings.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post('/api/settings', (req, res) => {
    const settings = req.body;
    const update = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const transaction = db.transaction((settings) => {
      for (const [key, value] of Object.entries(settings)) {
        update.run(key, String(value));
      }
    });
    transaction(settings);
    res.json({ success: true });
  });

  // Pages
  app.get('/api/pages', (req, res) => {
    const pages = db.prepare('SELECT id, title, slug FROM pages').all();
    res.json(pages);
  });

  app.get('/api/pages/:slug', (req, res) => {
    const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.slug);
    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ error: 'Página no encontrada' });
    }
  });

  app.post('/api/pages', (req, res) => {
    const { title, slug, content } = req.body;
    try {
      const result = db.prepare('INSERT INTO pages (title, slug, content) VALUES (?, ?, ?)').run(title, slug, content);
      res.json({ id: result.lastInsertRowid, title, slug });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/pages/:id', (req, res) => {
    const { title, slug, content } = req.body;
    try {
      db.prepare('UPDATE pages SET title = ?, slug = ?, content = ? WHERE id = ?').run(title, slug, content, req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/pages/:id', (req, res) => {
    db.prepare('DELETE FROM pages WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // News
  app.get('/api/news', (req, res) => {
    const news = db.prepare('SELECT * FROM news ORDER BY created_at DESC').all();
    res.json(news);
  });

  app.get('/api/news/:slug', (req, res) => {
    const newsItem = db.prepare('SELECT * FROM news WHERE slug = ?').get(req.params.slug);
    if (newsItem) {
      res.json(newsItem);
    } else {
      res.status(404).json({ error: 'Noticia no encontrada' });
    }
  });

  app.post('/api/news', upload.single('image'), (req, res) => {
    const { title, slug, content, video_url } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    try {
      const result = db.prepare('INSERT INTO news (title, slug, content, image_url, video_url) VALUES (?, ?, ?, ?, ?)').run(title, slug, content, image_url, video_url || null);
      res.json({ id: result.lastInsertRowid, title, slug });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/news/:id', upload.single('image'), (req, res) => {
    const { title, slug, content, video_url } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.existing_image_url;

    try {
      db.prepare('UPDATE news SET title = ?, slug = ?, content = ?, image_url = ?, video_url = ? WHERE id = ?').run(title, slug, content, image_url, video_url || null, req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/news/:id', (req, res) => {
    db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Upload endpoint for HTML Editor
  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (req.file) {
      res.json({ url: `/uploads/${req.file.filename}` });
    } else {
      res.status(400).json({ error: 'No se subió ningún archivo' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
