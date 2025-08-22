#!/usr/bin/env node

const ESP32Simulator = require('./esp32-simulator.js');

// Parse command line arguments
const args = process.argv.slice(2);
const fps = parseInt(args[0]) || 15; // Default to 15 FPS
const serverUrl = args[1] || 'ws://localhost:3000/ws/camera';

console.log(`🚀 Starting ESP32 Camera Simulator`);
console.log(`📡 Server URL: ${serverUrl}`);
console.log(`🎬 Frame Rate: ${fps} FPS`);
console.log(`⏱️  Frame Interval: ${1000/fps}ms`);
console.log('');

const simulator = new ESP32Simulator(serverUrl, fps);

// Load images
simulator.loadImages();

// Connect to server
simulator.connect();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down ESP32 simulator...');
  simulator.disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down ESP32 simulator...');
  simulator.disconnect();
  process.exit(0);
}); 