import { createRoot } from 'react-dom/client';

import App from './App';
import { RentalProvider } from './contexts/RentalContext';
import './index.css';
import './styles/Theme.css';

createRoot(document.getElementById('root')).render(
  <RentalProvider>
    <App />
  </RentalProvider>,
);
