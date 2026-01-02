import React from 'react';
import ReactDOM from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

import { HeroUIProvider, ToastProvider } from '@heroui/react';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { THEME_ID } from '@mui/material/styles';


import "./css/tailwind.css"
import "./css/styles.min.css"

import { Screen } from './components/Layout';
import Dashboard from './pages/Dashboard';
import { PlaybackDevices } from './components/SystemAudio';
import Assistant from './pages/Assistant';
import Reallusion from './pages/Reallusion';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: AppMain,
        children: [
          {
            path: '/',
            Component: Dashboard,
          },
          {
            path: '/audio-playback-device',
            Component: PlaybackDevices,
          },
          {
            path: '/assistant',
            Component: Assistant,
          },
          {
            path: '/reallusion',
            Component: Reallusion,
          },
        ]
      },
    ],
  },
]);

const theme = createTheme({
  palette: {
    mode: 'dark' // For the sign-in page
  },
  components: {
    MuiStack: {
      defaultProps: {
        gap: 1,
      },
    },
  },
});

function App() {
  return (
    <main className="dark text-foreground bg-background main">
      {/* <main className="main text-foreground bg-background"> */}
      <HeroUIProvider>
        <ToastProvider placement='top-right' toastOffset={112} />
        <MuiThemeProvider theme={{ [THEME_ID]: theme }}>
          <Outlet />
        </MuiThemeProvider>
      </HeroUIProvider>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&family=Zalando+Sans+SemiExpanded:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet"></link>
    </main>
  );
}

function AppMain() {

  return (
    <Screen>
      <Outlet />
    </Screen >
  )
}

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
