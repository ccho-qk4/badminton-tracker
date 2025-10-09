# Badminton Tracker

A modern, interactive badminton match tracking application built with React, TypeScript, and Tailwind CSS. Track your singles and doubles matches, monitor performance statistics, and visualize your progress over time.

## Features

- 🏸 Track both singles and doubles matches
- 📊 Real-time score tracking
- 📈 Performance statistics (win rate, average rally length, etc.)
- 📉 Visual charts showing match history
- 🎯 Rally-by-rally tracking with shot counts
- 💾 Match history with detailed statistics
- 🎨 Beautiful, responsive UI with Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js)

## Getting Started

### 1. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Recharts (for data visualization)
- Lucide React (for icons)

### 2. Run the Development Server

Start the development server:

```bash
npm run dev
```

The application will open in your default browser at `http://localhost:5173` (or another port if 5173 is busy).

### 3. Build for Production

To create a production-ready build:

```bash
npm run build
```

The optimized files will be generated in the `dist` folder.

### 4. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Usage

1. **Start a Match**: Choose between Singles or Doubles match from the home screen
2. **Track Points**: 
   - Click "You Won Point" or "Opponent Won" after each rally
   - Enter the number of shots in the rally
   - Click "Submit" to record the point
3. **View Progress**: See live score updates and recent rally history
4. **Finish Match**: Click "Finish Match" when done
5. **View Statistics**: Return to home to see your overall performance metrics and match history

## Project Structure

```
badminton-tracker/
├── src/
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles with Tailwind
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization
- **Lucide React** - Icon library

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements!
