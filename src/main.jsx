import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "./index.css"
import App from "./App.jsx"

console.log('OxyCare Labs: Mounting Application...');

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error('Fatal: Root element not found');
}
