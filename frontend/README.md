# GenAI Profiler Frontend

React + TypeScript frontend for the GenAI Profiler system.

## Tech Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool (fast HMR)
- **shadcn/ui**: Component library
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Axios**: HTTP client

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:5173

### 3. Make Sure Backend is Running

The frontend expects the backend API to be running at:
```
http://localhost:8000
```

Start the backend first:
```bash
cd ../backend
source venv/bin/activate  # or venv\Scripts\activate
uvicorn app.main:app --reload
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── separator.tsx
│   │   │   └── alert.tsx
│   │   ├── FileUpload.tsx         # Upload interface
│   │   ├── AnalysisProgress.tsx   # Progress indicator
│   │   └── ReportView.tsx         # Report display
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── App.tsx                    # Main application
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles + Tailwind
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## Components

### FileUpload

Upload interface with drag-and-drop support.

**Features:**
- Drag and drop ZIP files
- File validation (ZIP only, max 50MB)
- Demo data button
- Upload progress

### AnalysisProgress

Shows real-time analysis progress.

**Features:**
- Progress bar (0-100%)
- Stage indicators
- Status messages
- Pipeline step checklist

### ReportView

Displays the complete analysis report.

**Features:**
- Executive summary with metrics
- Detected techniques with confidence
- Expandable recommendations (accordion)
- Research paper references
- Code locations
- Confidence notes and limitations

## shadcn/ui Components

All UI components are from shadcn/ui library:

- **Button**: Primary actions
- **Card**: Content containers
- **Badge**: Labels and tags
- **Progress**: Progress bars
- **Accordion**: Collapsible sections
- **Separator**: Visual dividers
- **Alert**: Important messages

No custom CSS or custom components used!

## Styling

### Tailwind CSS

All styling uses Tailwind utility classes:

```tsx
<div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
  ...
</div>
```

### Theme

Theme is defined using CSS variables in `index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}
```

To change colors, edit these variables.

## API Integration

### Axios Configuration

API calls use Axios with proxy configuration:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

All requests to `/api/*` are proxied to the backend.

### Endpoints Used

```typescript
// Upload codebase
POST /api/v1/upload
FormData: { file: File }

// Check status
GET /api/v1/status/:jobId

// Get result
GET /api/v1/result/:jobId

// Demo data
GET /api/v1/demo-report
```

## Development

### Run Dev Server

```bash
npm run dev
```

**Hot Module Replacement (HMR)**: Changes auto-reload instantly

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## Customization

### Add New Component

Use shadcn/ui CLI:

```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add dialog
```

This adds the component to `src/components/ui/`.

### Change Theme Colors

Edit `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Change this */
}
```

Or use Tailwind classes:

```tsx
<Button className="bg-purple-600 hover:bg-purple-700">
  Custom Color
</Button>
```

### Add New Page

Since this is a single-page app, add state to `App.tsx`:

```tsx
type AppState = 'upload' | 'analyzing' | 'complete' | 'your-new-page'

// Add component
{state === 'your-new-page' && <YourNewPage />}
```

## Troubleshooting

### "Cannot find module '@/components/...'"

TypeScript path alias issue. Make sure:

1. `tsconfig.json` has:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

2. `vite.config.ts` has:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### "Network Error" when calling API

Check:
1. Backend is running on port 8000
2. Vite proxy is configured correctly
3. CORS is enabled in backend

### Components not styling correctly

1. Make sure Tailwind is imported in `index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. Check `tailwind.config.js` content paths:
```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

### Build errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or with yarn
rm -rf node_modules yarn.lock
yarn install
```

## Performance

- **Bundle size**: ~500KB (including shadcn/ui)
- **Load time**: < 1s on modern browsers
- **HMR**: < 100ms for most changes

## Deployment

### Static Hosting

Build and deploy to:
- Vercel
- Netlify
- GitHub Pages
- CloudFlare Pages

```bash
npm run build
# Upload dist/ folder
```

### Environment Variables

For production API URL, create `.env.production`:

```env
VITE_API_URL=https://your-api-domain.com
```

Then update axios calls:

```typescript
const API_URL = import.meta.env.VITE_API_URL || '';
axios.get(`${API_URL}/api/v1/...`);
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 12+, Chrome Android

## Accessibility

shadcn/ui components are built with accessibility in mind:

- Keyboard navigation
- Screen reader support
- ARIA attributes
- Focus management

## License

MIT License - See main README for details.
