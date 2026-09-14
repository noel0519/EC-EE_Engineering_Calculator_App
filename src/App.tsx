import { useEffect, useState } from 'react';
import { StoreProvider } from '@/state/store';
import { Shell } from '@/components/Shell';
import { ExportPage } from '@/pages/ExportPage';

function currentRoute(): string {
  return window.location.hash.replace(/^#/, '') || '/';
}

export function App() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return <StoreProvider>{route === '/export' ? <ExportPage /> : <Shell />}</StoreProvider>;
}
