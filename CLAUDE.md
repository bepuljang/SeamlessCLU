# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## Architecture Overview

This is a React-based automotive HMI (Human-Machine Interface) application built with Vite. The application displays vehicle information in a modular dashboard layout with 3D visualization capabilities.

### Core Architecture

**Component Hierarchy:**
- `App.jsx` wraps the entire app with `ContextProvider` for global state
- Main layout sections: `Header`, `Body`, `Footer`, `SignalControls`
- `Body` contains the primary 3D viewer and vehicle metrics displays

**State Management:**
- `ContextProvider`: Manages theme (light/dark) and color schemes
- `CANProvider`: Simulates CAN bus signals for vehicle data (speed, battery, gear mode, etc.)
- Both providers use React Context API for state distribution

**Layout System:**
- Custom `GridComponent` for responsive grid-based layouts
- Grid sizing rules defined in `rules/gridSizing.js`
- Components use grid dimensions (w, h) and alignment props (xAlign, yAlign)

### Key Technical Components

**3D Visualization (`ThreeDViewer`):**
- Uses React Three Fiber (@react-three/fiber) and Three.js
- Loads OBJ/MTL models from `/src/assets/obj/`
- Dynamic material processing based on part names (glass, chrome, paint, etc.)
- Configurable car colors tied to theme context
- OrbitControls with constrained camera movement

**Vehicle Widgets:**
- `SpeedMeter`: Displays current speed from CAN signals
- `Gearmode`: Shows current gear (P/R/N/D)
- `BatteryGauge`: Battery level and temperature visualization
- `OdoMeter`: Total and trip distance tracking

**CAN Signal Simulation:**
- Mock vehicle data generation in `CANProvider`
- Signals include: speed, gear, battery, temperatures, odometer, power consumption
- Simulation mode for development testing with realistic value changes

## Project Structure Patterns

- Components in `/src/components/` are reusable UI building blocks
- Objects in `/src/objects/` are specific HMI widgets and displays
- Sections in `/src/sections/` define major layout areas
- Context providers in `/src/context/` manage global state
- Rules in `/src/rules/` contain configuration constants

## Styling Approach

- Uses CSS modules with inline styles for dynamic theming
- Color schemes defined in `rules/colorScheme.js` for light/dark themes
- Grid-based layout system with custom GridComponent wrapper
- Responsive design through flexible grid dimensions