import { createRoot } from 'react-dom/client';
import App from './components/App';
import { AuthProvider } from './contexts/AuthContext';
import LogRocketService from './services/logRocketService';
import './index.css';

// Initialize LogRocket
LogRocketService.getInstance().init();

const root = createRoot(document.body);
root.render(
    <AuthProvider>
        <App />
    </AuthProvider>
);