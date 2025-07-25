#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Print debug information
console.log('=== Startup Debug Information ===');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('__filename:', __filename);

// Check for the dist directory and index.js file
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.js');

console.log('Looking for dist directory at:', distPath);
console.log('Looking for index.js at:', indexPath);

if (fs.existsSync(distPath)) {
    console.log('dist directory exists');
    console.log('dist directory contents:', fs.readdirSync(distPath));
} else {
    console.log('dist directory does NOT exist');
    // List current directory contents
    console.log('Current directory contents:', fs.readdirSync(__dirname));
}

if (fs.existsSync(indexPath)) {
    console.log('index.js file exists, starting application...');
    console.log('=== End Debug Information ===\n');
    
    // Start the actual application
    require(indexPath);
} else {
    console.error('ERROR: Cannot find index.js file at:', indexPath);
    console.log('=== Directory Structure Debug ===');
    
    // Recursively list files to help debug
    function listFiles(dir, prefix = '') {
        try {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    console.log(`${prefix}📁 ${file}/`);
                    if (prefix.length < 10) { // Prevent too deep recursion
                        listFiles(fullPath, prefix + '  ');
                    }
                } else {
                    console.log(`${prefix}📄 ${file}`);
                }
            });
        } catch (err) {
            console.log(`${prefix}❌ Error reading directory: ${err.message}`);
        }
    }
    
    console.log('Project structure:');
    listFiles(__dirname);
    console.log('=== End Directory Structure Debug ===');
    
    process.exit(1);
}
