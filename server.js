#!/usr/bin/env node

// Simple, direct start script for Render deployment
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Rent Management System Backend...');
console.log('Working directory:', process.cwd());

// Try multiple possible paths for the compiled JavaScript
const possiblePaths = [
    './dist/index.js',
    path.join(__dirname, 'dist', 'index.js'),
    path.join(process.cwd(), 'dist', 'index.js'),
    '/opt/render/project/src/dist/index.js'
];

let appPath = null;

for (const testPath of possiblePaths) {
    console.log(`Checking path: ${testPath}`);
    if (fs.existsSync(testPath)) {
        appPath = testPath;
        console.log(`✅ Found application at: ${appPath}`);
        break;
    } else {
        console.log(`❌ Not found: ${testPath}`);
    }
}

if (appPath) {
    console.log('Starting application...\n');
    require(appPath);
} else {
    console.error('❌ Could not find the compiled application!');
    console.log('\n📂 Current directory structure:');
    
    try {
        const listDir = (dir, depth = 0) => {
            if (depth > 2) return; // Limit recursion
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const indent = '  '.repeat(depth);
                try {
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory()) {
                        console.log(`${indent}📁 ${item}/`);
                        listDir(fullPath, depth + 1);
                    } else {
                        console.log(`${indent}📄 ${item}`);
                    }
                } catch (err) {
                    console.log(`${indent}❓ ${item} (cannot read)`);
                }
            });
        };
        
        listDir(process.cwd());
    } catch (err) {
        console.error('Error listing directory:', err.message);
    }
    
    process.exit(1);
}
