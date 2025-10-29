#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let serverProcess = null;
let restartCount = 0;
let lastRestartTime = Date.now();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function startServer() {
  log('🚀 Starting Next.js development server...', 'blue');
  
  serverProcess = spawn('npm', ['run', 'dev:next'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname + '/..',
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=4096',
      WATCHPACK_POLLING: 'true',
    }
  });

  serverProcess.on('exit', (code, signal) => {
    log(`\n⚠️  Server exited with code ${code} and signal ${signal}`, 'yellow');
    
    // Check if we're restarting too frequently
    const timeSinceLastRestart = Date.now() - lastRestartTime;
    if (timeSinceLastRestart < 5000) {
      restartCount++;
      if (restartCount > 5) {
        log('❌ Server crashed too many times. Waiting 30 seconds before restart...', 'red');
        setTimeout(() => {
          restartCount = 0;
          startServer();
        }, 30000);
        return;
      }
    } else {
      restartCount = 0;
    }
    
    lastRestartTime = Date.now();
    
    log('♻️  Restarting server in 2 seconds...', 'green');
    setTimeout(startServer, 2000);
  });

  serverProcess.on('error', (error) => {
    log('❌ Failed to start server: ' + error.message, 'red');
    setTimeout(startServer, 5000);
  });
}

function restartServer() {
  if (serverProcess) {
    log('🔄 Restarting server...', 'cyan');
    serverProcess.kill('SIGTERM');
  } else {
    startServer();
  }
}

// Handle termination signals
process.on('SIGINT', () => {
  log('\n👋 Shutting down development server...', 'yellow');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log('❌ Uncaught exception: ' + error.message, 'red');
  console.error(error);
});

process.on('unhandledRejection', (reason, promise) => {
  log('❌ Unhandled rejection at: ' + promise, 'red');
  console.error(reason);
});

// Start the server
log('🎯 BimVerdi Development Server Wrapper', 'bright');
log('📍 Working directory: ' + process.cwd(), 'cyan');
log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
startServer();
