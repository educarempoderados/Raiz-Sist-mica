import {StrictMode, useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import Admin from './Admin.tsx';
import PoliticaPrivacidade from './PoliticaPrivacidade.tsx';
import Obrigado from './Obrigado.tsx';
import './index.css';

function MainRouter() {
  const [hash, setHash] = useState(window.location.hash);
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    
    // For local handling of pushState (if any)
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      setPathname(window.location.pathname);
    };

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      history.pushState = originalPushState;
    };
  }, []);

  if (pathname === '/politica-de-privacidade' || pathname === '/politica-de-privacidade/') {
    return <PoliticaPrivacidade />;
  }

  if (pathname === '/obrigado' || pathname === '/obrigado/') {
    return <Obrigado />;
  }

  if (hash === '#admin') {
    return <Admin />;
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainRouter />
  </StrictMode>,
);
