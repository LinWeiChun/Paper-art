import { createRoot } from 'react-dom/client';

import App from './App';
import { RentalProvider } from './contexts/RentalContext';
import './index.css';
import './styles/Theme.css';
import './styles/shared.css';

import 'ckeditor5/ckeditor5.css';
createRoot(document.getElementById('root')).render(
  <RentalProvider>
    <App />
  </RentalProvider>,
);
