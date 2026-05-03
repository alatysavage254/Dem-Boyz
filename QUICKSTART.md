# Quick Start Guide

## 🚀 Running the Gallery

### Option 1: Python Server (Recommended)
```bash
cd Dem-Boyz
python3 -m http.server 8000
```
Then open: `http://localhost:8000`

### Option 2: Node.js Server
```bash
npx serve Dem-Boyz
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## 📁 Project Structure

```
Dem-Boyz/
├── index.html              # Main HTML file
├── css/                    # Modular stylesheets
│   ├── variables.css       # Design tokens
│   ├── base.css           # Base styles
│   ├── components.css     # UI components
│   ├── thumbnails.css     # Thumbnail gallery
│   ├── modals.css         # Modals & overlays
│   └── responsive.css     # Responsive design
├── js/                     # Modular JavaScript
│   ├── app.js             # Main entry point
│   ├── config.js          # Configuration
│   ├── state.js           # State management
│   ├── gallery.js         # Gallery core
│   ├── slideshow.js       # Slideshow controller
│   ├── ui.js              # UI components
│   ├── events.js          # Event handlers
│   └── utils.js           # Utilities
├── img/                    # Image assets
└── main.js                 # Legacy file (can be removed)
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous image |
| `→` | Next image |
| `Space` | Play/Pause slideshow |
| `Enter` | Open lightbox |
| `Esc` | Close modals |
| `S` | Shuffle images |
| `T` | Cycle transitions |
| `F` | Toggle favorite |
| `K` | Command palette |
| `?` | Show help |

## 🎨 Customization

### Change Slideshow Speed
Edit `js/config.js`:
```javascript
slideshow: {
    interval: 4000,  // Change to desired milliseconds
    // ...
}
```

### Change Colors
Edit `css/variables.css`:
```css
:root {
    --color-accent-primary: #6366f1;  /* Your color */
    /* ... */
}
```

### Change Transitions
Edit `js/config.js`:
```javascript
export const TRANSITIONS = ['fade', 'slide', 'zoom', 'blur'];
// Add your custom transitions
```

## 🐛 Troubleshooting

### Images not loading?
- Check that images are in the `img/` folder
- Verify image paths in `index.html`
- Check browser console for errors

### Modules not working?
- Must use a web server (not `file://`)
- Check that all JS files are in `js/` folder
- Verify `type="module"` in script tag

### Styles not applying?
- Check that all CSS files are in `css/` folder
- Verify link tags in `index.html`
- Clear browser cache

## 📱 Mobile Testing

### iOS Safari
- Open in Safari
- Test swipe gestures
- Check safe area insets

### Android Chrome
- Open in Chrome
- Test touch interactions
- Check viewport scaling

## 🔧 Development

### Adding New Images
1. Add images to `img/` folder
2. Update `index.html` thumbnail section:
```html
<img src="img/your-image.jpg" alt="Description" width="600" height="400" data-index="X">
```

### Adding New Features
1. Add configuration to `js/config.js`
2. Implement in appropriate module
3. Update UI in `js/ui.js`
4. Add event handlers in `js/events.js`

### Debugging
```javascript
// Access app instance in console
window.galleryApp

// Access state
window.galleryApp.gallery.state

// Trigger events manually
window.galleryApp.gallery.nextImage()
```

## 🎯 Performance Tips

1. **Optimize Images**: Use WebP format for smaller file sizes
2. **Lazy Load**: Already implemented for thumbnails
3. **Preload**: Adjust preload count in config
4. **Reduce Motion**: Automatically respects user preferences

## 📊 Browser Support

### Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Partial Support
- IE 11: Not supported (uses ES6 modules)
- Older browsers: May need polyfills

## 🚢 Deployment

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --dir=Dem-Boyz
```

### GitHub Pages
1. Push to GitHub
2. Enable Pages in settings
3. Select branch and folder

## 📝 Notes

- No build step required
- Pure vanilla JavaScript
- No dependencies
- Works offline (after first load)
- Mobile-first responsive design

## 🆘 Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are present
3. Test in different browser
4. Check REFACTOR_NOTES.md for details

## ✨ Enjoy!

Your gallery is now running with elite-level UI/UX! 🎉
