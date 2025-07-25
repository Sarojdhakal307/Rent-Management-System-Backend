#!/usr/bin/env node

// Simple start script to ensure correct working directory
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Get the directory where this script is located (project root)
const projectRoot = __dirname;

// Path to the compiled index.js
const indexPath = path.join(projectRoot, 'dist', 'index.js');

console.log('Project root:', projectRoot);
console.log('Starting application from:', indexPath);

// Verify that the compiled file exists
if (!fs.existsSync(indexPath)) {
  console.error('ERROR: Compiled index.js not found at:', indexPath);
  console.error('Available files in dist:');
  const distPath = path.join(projectRoot, 'dist');
  if (fs.existsSync(distPath)) {
    console.error(fs.readdirSync(distPath));
  } else {
    console.error('dist directory does not exist');
  }
  process.exit(1);
}

// Change to project root directory
process.chdir(projectRoot);
console.log('Current working directory:', process.cwd());

// Start the application
const child = spawn('node', [indexPath], {
  stdio: 'inherit',
  cwd: projectRoot
});

child.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Application exited with code: ${code}`);
  process.exit(code);
});
