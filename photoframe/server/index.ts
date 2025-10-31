import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import fs from "fs";
import https from "https";

const app = express();

// CORS middleware - Allow requests from Home Assistant
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error but DON'T crash the process
    console.error('[ERROR]', err);
    
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // Serve card file from client/public for Home Assistant ingress (both dev and prod)
  const clientPublicPath = path.join(process.cwd(), "client", "public");
  if (fs.existsSync(clientPublicPath)) {
    app.use(express.static(clientPublicPath));
  }

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`HTTP serving on port ${port}`);
  });

  // Create HTTPS server with self-signed certificate
  try {
    const certDir = path.join(process.cwd(), 'certs');
    const certPath = path.join(certDir, 'server.crt');
    const keyPath = path.join(certDir, 'server.key');
    
    // Create self-signed certificate if it doesn't exist
    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      log('Creating self-signed SSL certificate...');
      if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
      }
      
      // Generate self-signed certificate using Node.js crypto
      const { execSync } = await import('child_process');
      try {
        execSync(
          `openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365 ` +
          `-keyout "${keyPath}" -out "${certPath}" ` +
          `-subj "/C=IT/ST=State/L=City/O=PhotoFrame/CN=192.168.178.80"`,
          { stdio: 'inherit' }
        );
        log('Self-signed certificate created successfully');
      } catch (err) {
        log('OpenSSL not available, HTTPS will not be enabled');
      }
    }

    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };

      const httpsPort = parseInt(process.env.HTTPS_PORT || '5443', 10);
      const httpsServer = https.createServer(httpsOptions, app);
      
      httpsServer.listen({
        port: httpsPort,
        host: "0.0.0.0",
        reusePort: true,
      }, () => {
        log(`HTTPS serving on port ${httpsPort}`);
      });
    }
  } catch (error) {
    log('HTTPS setup failed, continuing with HTTP only');
  }
})();
