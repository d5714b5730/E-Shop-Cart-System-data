import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || "d5714b5730/E-Shop-Cart-System-data";
const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || "products.json";
const SETTINGS_FILE_PATH = "settings.json";

// Debug API to check environment variables (without exposing token)
app.get("/api/debug", (req, res) => {
  res.json({
    hasToken: !!process.env.GITHUB_TOKEN,
    repo: process.env.GITHUB_REPO || "d5714b5730/E-Shop-Cart-System-data",
    filePath: process.env.GITHUB_FILE_PATH || "products.json",
    branch: process.env.GITHUB_BRANCH || "main",
    nodeEnv: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL
  });
});

// API to get products from GitHub
app.get("/api/products", async (req, res) => {
    try {
      if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: "GITHUB_TOKEN is not configured" });
      }

      const response = await globalThis.fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }

      const data = await response.json() as any;
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      
      res.json({
        products: JSON.parse(content),
        sha: data.sha
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API to get settings from GitHub
  app.get("/api/settings", async (req, res) => {
    try {
      if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: "GITHUB_TOKEN is not configured" });
      }

      const response = await globalThis.fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${SETTINGS_FILE_PATH}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        // If file doesn't exist, return default settings
        return res.json({
          settings: {
            title: "90s加購專區",
            subtitle: [
              "此專區僅供「預購商品」加購 & 訂單生成，特賣會款式無列入。",
              "特賣會期間亦可加購（此專區不列入特賣會免運，但可合併出貨省運費）。"
            ],
            logoUrl: "",
            orderFooterText: "📍前往IG將圖片發給九零統計結帳📍",
            orderFooterSubText: "- 此專區僅用於預購商品的訂單生成 -",
            shippingFee: 60,
            freeShippingThreshold: 1000
          },
          sha: null
        });
      }

      const data = await response.json() as any;
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      
      res.json({
        settings: JSON.parse(content),
        sha: data.sha
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API to save settings to GitHub
  app.post("/api/settings", async (req, res) => {
    try {
      if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: "GITHUB_TOKEN is not configured" });
      }

      const { settings, sha } = req.body;

      const response = await globalThis.fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${SETTINGS_FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
          body: JSON.stringify({
            message: "更新網站設定",
            content: Buffer.from(JSON.stringify(settings, null, 2)).toString('base64'),
            sha: sha || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }

      const data = await response.json() as any;
      res.json({ success: true, sha: data.content.sha });
    } catch (error) {
      console.error("Error saving settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API to save products to GitHub
  app.post("/api/products", async (req, res) => {
    try {
      if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: "GITHUB_TOKEN is not configured" });
      }

      const { products, sha } = req.body;

      const response = await globalThis.fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
          body: JSON.stringify({
            message: "更新商品",
            content: Buffer.from(JSON.stringify(products, null, 2)).toString('base64'),
            sha: sha,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }

      const data = await response.json() as any;
      res.json({ success: true, sha: data.content.sha });
    } catch (error) {
      console.error("Error saving products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API to upload image to GitHub
  app.post("/api/upload-image", async (req, res) => {
    try {
      if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: "GITHUB_TOKEN is not configured" });
      }

      const { content, fileName } = req.body;
      const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

      const response = await globalThis.fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/images/${fileName}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
          body: JSON.stringify({
            message: "上传商品图片",
            content: content,
            branch: GITHUB_BRANCH,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json() as any;
        // If file already exists, we might get an error. 
        // For simplicity, we'll just return the error for now.
        return res.status(response.status).json(errorData);
      }

      const url = `/api/images/images/${fileName}`;
      res.json({ success: true, url });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Proxy for GitHub images (useful for private repos)
  app.get("/api/images/*", async (req, res) => {
    try {
      if (!GITHUB_TOKEN) {
        return res.status(500).send("GITHUB_TOKEN is not configured");
      }

      const filePath = req.params[0];
      const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
      
      // Encode each part of the path to handle spaces and special characters
      const encodedPath = filePath.split('/').map(part => encodeURIComponent(part)).join('/');
      
      const response = await globalThis.fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodedPath}?ref=${GITHUB_BRANCH}`,
        {
          headers: {
            Accept: "application/vnd.github.v3.raw",
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        return res.status(response.status).send("Image not found");
      }

      const contentType = response.headers.get("content-type");
      if (contentType) {
        res.setHeader("Content-Type", contentType);
      }
      
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).send("Internal server error");
    }
  });

async function setupApp() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }
}

// Start server if not running on Vercel
if (!process.env.VERCEL) {
  setupApp().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
