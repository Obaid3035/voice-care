const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

class ESP32Simulator {
  constructor(serverUrl = 'ws://localhost:3000/ws/camera', fps = 15) {
    this.serverUrl = serverUrl;
    this.fps = fps;
    this.frameInterval = 1000 / fps; 
    this.ws = null;
    this.isConnected = false;
    this.imageFiles = [];
    this.currentImageIndex = 0;
    this.intervalId = null;
  }

  loadImages(imageDir = './sample-images') {
    try {
      if (!fs.existsSync(imageDir)) {
        console.log(`Creating sample images directory: ${imageDir}`);
        fs.mkdirSync(imageDir, { recursive: true });
        
        this.createSampleImages(imageDir);
      }

      const files = fs.readdirSync(imageDir);
      this.imageFiles = files
        .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
        .map(file => path.join(imageDir, file))
        .sort((a, b) => {
          const getNumber = (filename) => {
            const match = path.basename(filename).match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
          };
          
          const numA = getNumber(a);
          const numB = getNumber(b);
          
          return numA - numB; 
        });

      console.log(`Loaded ${this.imageFiles.length} images from ${imageDir}`);
      
      // Show first few and last few images to verify sorting
      if (this.imageFiles.length > 0) {
        const firstFew = this.imageFiles.slice(0, 5).map(f => path.basename(f));
        const lastFew = this.imageFiles.slice(-5).map(f => path.basename(f));
        console.log(`📁 First 5 images: ${firstFew.join(', ')}`);
        console.log(`📁 Last 5 images: ${lastFew.join(', ')}`);
      }
      
      if (this.imageFiles.length === 0) {
        console.log('No image files found. Creating sample images...');
        this.createSampleImages(imageDir);
        this.loadImages(imageDir);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }

  createSampleImages(imageDir) {
    const sampleImages = [
      { name: 'sample1.jpg', data: this.createSampleImageData(640, 480, '#FF0000') },
      { name: 'sample2.jpg', data: this.createSampleImageData(640, 480, '#00FF00') },
      { name: 'sample3.jpg', data: this.createSampleImageData(640, 480, '#0000FF') },
      { name: 'sample4.jpg', data: this.createSampleImageData(640, 480, '#FFFF00') },
      { name: 'sample5.jpg', data: this.createSampleImageData(640, 480, '#FF00FF') }
    ];

    sampleImages.forEach(({ name, data }) => {
      const filePath = path.join(imageDir, name);
      fs.writeFileSync(filePath, data);
      console.log(`Created sample image: ${name}`);
    });
  }

  createSampleImageData(width, height, color) {

    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="24">
        ESP32 Camera Simulator
      </text>
    </svg>`;
    
    return Buffer.from(svg);
  }

  connect() {
    console.log(`Connecting to ${this.serverUrl}...`);
    
    this.ws = new WebSocket(this.serverUrl);
    
    this.ws.on('open', () => {
      console.log('✅ Connected to WebSocket server');
      this.isConnected = true;
      
      this.ws.send(JSON.stringify({
        type: 'camera_identify',
        data: { 
          deviceType: 'ESP32-CAM',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        }
      }));
      
      this.startStreaming();
    });
    
    this.ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('📨 Received message:', message.type);
        
        if (message.type === 'status') {
          console.log('📊 Server status:', message.data);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    
    this.ws.on('close', () => {
      console.log('❌ Disconnected from WebSocket server');
      this.isConnected = false;
      this.stopStreaming();
    });
    
    this.ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error.message);
    });
  }

  startStreaming() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    console.log(`🎥 Starting camera stream at ${this.fps} FPS...`);
    
    this.intervalId = setInterval(() => {
      if (this.isConnected && this.imageFiles.length > 0) {
        this.sendFrame();
      }
    }, this.frameInterval); 
  }

  stopStreaming() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️ Stopped camera stream');
    }
  }

  sendFrame() {
    try {
      const imagePath = this.imageFiles[this.currentImageIndex];
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      
      const frameData = {
        type: 'frame',
        frame: base64Image,
        metadata: {
          timestamp: new Date().toISOString(),
          filename: path.basename(imagePath),
          size: imageBuffer.length,
          index: this.currentImageIndex
        }
      };
      
      this.ws.send(JSON.stringify(frameData));
      
      if (this.currentImageIndex % 30 === 0) {
        console.log(`📸 Sent frame ${this.currentImageIndex + 1}/${this.imageFiles.length}: ${path.basename(imagePath)}`);
      }
      
      this.currentImageIndex = (this.currentImageIndex + 1) % this.imageFiles.length;
      
    } catch (error) {
      console.error('Error sending frame:', error);
    }
  }

  disconnect() {
    this.stopStreaming();
    if (this.ws) {
      this.ws.close();
    }
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const fps = parseInt(args[0]) || 15; 
  const serverUrl = args[1] || 'ws://localhost:3000/ws/camera';
  
  console.log(`🚀 Starting ESP32 Camera Simulator`);
  console.log(`📡 Server URL: ${serverUrl}`);
  console.log(`🎬 Frame Rate: ${fps} FPS`);
  console.log(`⏱️  Frame Interval: ${1000/fps}ms`);
  console.log('');
  
  const simulator = new ESP32Simulator(serverUrl, fps);
  
  simulator.loadImages();
  
  simulator.connect();
  
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
}

module.exports = ESP32Simulator; 