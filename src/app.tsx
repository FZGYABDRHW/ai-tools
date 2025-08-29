import { createRoot } from 'react-dom/client';
import App from './components/App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const root = createRoot(document.body);
root.render(
    <AuthProvider>
        <App />
    </AuthProvider>
);