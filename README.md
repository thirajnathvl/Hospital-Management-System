# MedCore - Advanced Hospital Information & Management System

MedCore is a comprehensive, responsive, single-page application (SPA) that acts as both an external public portal and an internal hospital management dashboard.

## Folder Structure
- `index.html` - App shell, layout layout containers, dynamic view blocks, and modals.
- `styles.css` - Custom styling using CSS Grid/Flexbox, dynamic CSS custom properties for Light/Dark themes, glassmorphic cards, animations.
- `app.js` - Mock data generator, client-side routing, state manager, booking engine, notification queue, and interactive event handlers.

## Getting Started
Simply double-click on `index.html` or open it with any web browser (Chrome, Firefox, Safari, Edge) to run the application locally. No local server, npm dependencies, or databases are required!

## User Role Simulation
At the top of the app bar, use the **Role Simulator** dropdown to switch between:
1. **Patient**: View medical history, book appointments, check active prescriptions, review and pay bills.
2. **Doctor**: View daily consultation schedule, manage patients, write new digital prescriptions (updates Patient view dynamically).
3. **Administrator**: Monitor live metrics (beds, staff, billing statistics), check department loads, toggle hospital emergency states.
