# College Campus Tour - Three.js

A 3D interactive walkthrough of your college campus using Three.js.

## Setup Instructions

### 1. Add Your Campus Model
- Place your `.glb` file in this folder
- Open `main.js` and update line 150 with your filename:
  ```javascript
  loader.load('your-campus-model.glb', // <-- Change this
  ```

### 2. Run the Project

#### Option A: Using a Local Server (Recommended)

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

**Using Node.js:**
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server

# Then open: http://localhost:8080
```

**Using VS Code:**
- Install "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

#### Option B: Using a Browser (Chrome/Edge)
1. Open Chrome/Edge with disabled security (only for development)
2. Close all browser instances
3. Run with CORS disabled:
   ```bash
   # Windows
   chrome.exe --disable-web-security --user-data-dir="C:/temp/chrome-dev"
   ```

### 3. Controls
- **Click** anywhere to start
- **W/↑** - Move forward
- **S/↓** - Move backward
- **A/←** - Strafe left
- **D/→** - Strafe right
- **Mouse** - Look around
- **ESC** - Exit pointer lock mode

## Features
- ✅ First-person camera controls
- ✅ GLB model loading
- ✅ Realistic lighting (ambient, directional, hemisphere)
- ✅ Fog effect for atmosphere
- ✅ Shadow rendering
- ✅ Keyboard + mouse controls
- ✅ Stickman character (can be made visible for third-person view)

## Customization

### Adjust Movement Speed
In `main.js`, line 103:
```javascript
const moveSpeed = 5.0; // Increase or decrease
```

### Adjust Camera Height (Eye Level)
In `main.js`, line 31 and 233:
```javascript
camera.position.set(0, 1.7, 5); // 1.7 meters is average eye height
```

### Change to Third-Person View
In `main.js`, line 206, change:
```javascript
stickmanGroup.visible = true; // Show stickman
```

Then adjust camera position to be behind the character.

### Modify Lighting
Adjust light intensities in `main.js` (lines 47-67) for different times of day.

## Troubleshooting

### Model not loading?
- Check browser console (F12) for errors
- Ensure GLB filename matches exactly (case-sensitive)
- Verify file is in the same folder as index.html
- Must use a local server (CORS policy)

### Controls not working?
- Click on the screen first to activate pointer lock
- Check browser console for JavaScript errors

### Performance issues?
- Optimize your GLB model (reduce polygon count)
- Reduce shadow map size in `main.js` (line 60)
- Lower renderer pixel ratio (line 40)

## Next Steps
- Add collision detection with the campus buildings
- Implement jump functionality
- Add minimap
- Include interactive points of interest
- Add day/night cycle
- Include ambient sounds

Enjoy your campus tour! 🎓
