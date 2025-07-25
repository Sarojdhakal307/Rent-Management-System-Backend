import express, { Request, Response } from "express";
import fs from 'fs';
import path from 'path';

const docsRouter = express.Router();

// Documentation endpoints
docsRouter.get("/readme", (req: Request, res: Response) => {
  try {
    const readmePath = path.join(__dirname, '../../README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(readmeContent);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "README.md not found",
      error: "FILE_NOT_FOUND"
    });
  }
});

docsRouter.get("/api", (req: Request, res: Response) => {
  try {
    const docsPath = path.join(__dirname, '../../docs.md');
    const docsContent = fs.readFileSync(docsPath, 'utf-8');
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(docsContent);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "docs.md not found",
      error: "FILE_NOT_FOUND"
    });
  }
});

// HTML rendered documentation endpoints
docsRouter.get("/readme/html", (req: Request, res: Response) => {
  try {
    const readmePath = path.join(__dirname, '../../README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');
    
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rent Management System - README</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css">
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <style>
            body { 
                max-width: 1200px; 
                margin: 0 auto; 
                padding: 20px; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
                background-color: #ffffff;
            }
            .markdown-body { 
                box-sizing: border-box; 
                min-width: 200px; 
                max-width: 980px; 
                margin: 0 auto; 
                padding: 45px; 
            }
            .header {
                text-align: center;
                padding: 20px 0;
                border-bottom: 1px solid #e1e4e8;
                margin-bottom: 30px;
            }
            .nav-links {
                text-align: center;
                margin-bottom: 30px;
            }
            .nav-links a {
                margin: 0 15px;
                padding: 8px 16px;
                background: #0366d6;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-size: 14px;
            }
            .nav-links a:hover {
                background: #0256cc;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🏠 Rent Management System</h1>
            <p>Comprehensive Documentation</p>
        </div>
        <div class="nav-links">
            <a href="/api/docs/readme/html">📖 README</a>
            <a href="/api/docs/api/html">📚 API Docs</a>
            <a href="/api">🏠 API Home</a>
            <a href="https://github.com/Sarojdhakal307/Rent-Management-System-Backend" target="_blank">🔗 GitHub</a>
        </div>
        <div class="markdown-body" id="content"></div>
        <script>
            document.getElementById('content').innerHTML = marked.parse(\`${readmeContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
        </script>
    </body>
    </html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "README.md not found",
      error: "FILE_NOT_FOUND"
    });
  }
});

docsRouter.get("/api/html", (req: Request, res: Response) => {
  try {
    const docsPath = path.join(__dirname, '../../docs.md');
    const docsContent = fs.readFileSync(docsPath, 'utf-8');
    
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rent Management System - API Documentation</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css">
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <style>
            body { 
                max-width: 1200px; 
                margin: 0 auto; 
                padding: 20px; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
                background-color: #ffffff;
            }
            .markdown-body { 
                box-sizing: border-box; 
                min-width: 200px; 
                max-width: 980px; 
                margin: 0 auto; 
                padding: 45px; 
            }
            .header {
                text-align: center;
                padding: 20px 0;
                border-bottom: 1px solid #e1e4e8;
                margin-bottom: 30px;
            }
            .nav-links {
                text-align: center;
                margin-bottom: 30px;
            }
            .nav-links a {
                margin: 0 15px;
                padding: 8px 16px;
                background: #0366d6;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-size: 14px;
            }
            .nav-links a:hover {
                background: #0256cc;
            }
            .api-badge {
                display: inline-block;
                background: #28a745;
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                margin-left: 8px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 API Documentation</h1>
            <p>Rent Management System Backend API <span class="api-badge">v1.0.0</span></p>
            <p><strong>Base URL:</strong> <code>https://api-rms.onrender.com</code></p>
        </div>
        <div class="nav-links">
            <a href="/api/docs/readme/html">📖 README</a>
            <a href="/api/docs/api/html">📚 API Docs</a>
            <a href="/api">🏠 API Home</a>
            <a href="https://github.com/Sarojdhakal307/Rent-Management-System-Backend" target="_blank">🔗 GitHub</a>
        </div>
        <div class="markdown-body" id="content"></div>
        <script>
            document.getElementById('content').innerHTML = marked.parse(\`${docsContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
        </script>
    </body>
    </html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "docs.md not found",
      error: "FILE_NOT_FOUND"
    });
  }
});

// Documentation index/landing page
docsRouter.get("/", (req: Request, res: Response) => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rent Management System - Documentation Hub</title>
      <style>
          body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
          }
          .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              max-width: 600px;
              text-align: center;
          }
          h1 {
              color: #2c3e50;
              margin-bottom: 10px;
              font-size: 2.5em;
          }
          .subtitle {
              color: #7f8c8d;
              margin-bottom: 30px;
              font-size: 1.2em;
          }
          .docs-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 30px 0;
          }
          .doc-card {
              background: #f8f9fa;
              border: 2px solid #e9ecef;
              border-radius: 8px;
              padding: 25px;
              text-decoration: none;
              color: #2c3e50;
              transition: all 0.3s ease;
          }
          .doc-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 5px 15px rgba(0,0,0,0.1);
              border-color: #007bff;
          }
          .doc-icon {
              font-size: 2em;
              margin-bottom: 10px;
              display: block;
          }
          .doc-title {
              font-weight: bold;
              margin-bottom: 8px;
              font-size: 1.1em;
          }
          .doc-desc {
              font-size: 0.9em;
              color: #6c757d;
          }
          .api-info {
              background: #e8f5e8;
              border: 1px solid #c3e6c3;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
          }
          .api-url {
              font-family: 'Courier New', monospace;
              background: #f8f9fa;
              padding: 8px 12px;
              border-radius: 4px;
              color: #e83e8c;
              font-weight: bold;
          }
          .footer {
              margin-top: 30px;
              color: #6c757d;
              font-size: 0.9em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>🏠 Rent Management System</h1>
          <div class="subtitle">Documentation Hub</div>
          
          <div class="api-info">
              <strong>🚀 Live API:</strong><br>
              <span class="api-url">https://api-rms.onrender.com</span>
          </div>

          <div class="docs-grid">
              <a href="/api/docs/readme/html" class="doc-card">
                  <span class="doc-icon">📖</span>
                  <div class="doc-title">README</div>
                  <div class="doc-desc">Project overview, setup instructions, and getting started guide</div>
              </a>
              
              <a href="/api/docs/api/html" class="doc-card">
                  <span class="doc-icon">📚</span>
                  <div class="doc-title">API Documentation</div>
                  <div class="doc-desc">Complete API reference with endpoints, examples, and responses</div>
              </a>
          </div>

          <div style="margin: 20px 0;">
              <a href="/api" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
                  🏠 API Home
              </a>
              <a href="https://github.com/Sarojdhakal307/Rent-Management-System-Backend" target="_blank" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
                  🔗 GitHub Repository
              </a>
          </div>

          <div class="footer">
              Made with ❤️ by <strong>Saroj Dhakal</strong><br>
              Version 1.0.0 • Last Updated: July 2025
          </div>
      </div>
  </body>
  </html>`;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(htmlContent);
});

export { docsRouter };
