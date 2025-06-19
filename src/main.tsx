import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateDocumentTitle, updateDocumentMeta } from './lib/utils'

// Initialize branding on app load
updateDocumentTitle();
updateDocumentMeta();

createRoot(document.getElementById("root")!).render(<App />);
