# Curated Lodges - Frontend

A Next.js application for showcasing extraordinary wildlife lodges around the world.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Running the Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at:
- Primary: http://localhost:3000
- If port 3000 is busy: http://localhost:3001

### Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── curated_lodges/      # Curated Lodges page
│   │   │   └── page.jsx
│   │   ├── layout.jsx            # Root layout
│   │   ├── page.jsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   └── Layout/
│   │       ├── Header.jsx
│   │       ├── Header.module.css
│   │       ├── HeaderLogin.jsx
│   │       ├── Footer.jsx
│   │       └── Footer.module.css
│   ├── contexts/
│   │   └── LocalizationContext.jsx
│   ├── store/
│   │   ├── store.js
│   │   ├── ReduxProvider.jsx
│   │   └── slices/
│   │       └── tokenSlice.js
│   └── lib/
│       └── i18n.js
├── public/
│   └── assests/                  # Static assets (images, etc.)
│       └── images/
├── next.config.js
├── jsconfig.json
└── package.json
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Features

- **Next.js 14** - React framework with App Router
- **Redux Toolkit** - State management
- **Redux Persist** - Persist Redux state
- **React i18next** - Internationalization
- **Lucide React** - Icon library
- **Bootstrap** - CSS framework
- **CSS Modules** - Component-scoped styling

### Key Pages

- **Home** (`/`) - Landing page
- **Curated Lodges** (`/curated_lodges`) - Showcase of wildlife lodges with interactive map

### Configuration

The project includes:
- Path alias `@/` pointing to `src/`
- Image optimization for external domains
- Redux store with token management
- Localization context for language and currency
- Bootstrap grid system integration

### Important Notes

1. **Image Assets**: Images are stored in `public/assests/images/` (note the spelling)
2. **Redux State**: Token data is persisted to localStorage
3. **Localization**: Language and currency preferences are saved to localStorage
4. **Responsive Design**: Mobile-first approach with Bootstrap grid

### Troubleshooting

If you encounter port conflicts, the dev server will automatically try the next available port.

If you see module not found errors, ensure all dependencies are installed:
```bash
npm install
```

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Production Build

To build for production:

```bash
npm run build
npm start
```

This will create an optimized production build in the `.next` directory.
