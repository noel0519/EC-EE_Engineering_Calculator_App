import { StoreProvider } from '@/state/store';
import { Shell } from '@/components/Shell';

export function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
