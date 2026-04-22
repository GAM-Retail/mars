import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { ErrorBoundary, Suspense } from 'solid-js';
import './app.css';
import { getCookie } from '@solidjs/start/http';
import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR } from '@kobalte/core';
import { isServer } from 'solid-js/web';
import { MetaProvider } from '@solidjs/meta';
import AppCrash from '~/components/AppCrash';

function getServerCookies() {
  'use server';
  const colorMode = getCookie('kb-color-mode');
  return colorMode ? `kb-color-mode=${colorMode}` : '';
}

export default function App() {
  const storageManager = cookieStorageManagerSSR(isServer ? getServerCookies() : document.cookie);
  return (
    <MetaProvider>
      <Router
        root={(props) => (
          <>
            <ColorModeScript storageType={storageManager.type} />
            <ColorModeProvider storageManager={storageManager}>
              <ErrorBoundary fallback={(err) => <AppCrash error={err} />}>
                <Suspense>{props.children}</Suspense>
              </ErrorBoundary>
            </ColorModeProvider>
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
