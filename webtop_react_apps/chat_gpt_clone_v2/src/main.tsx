import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';

import { HeroUIProvider } from "@heroui/react";

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// import { DialogsProvider, NavigationItem } from '@toolpad/core';
// import { ReactRouterAppProvider } from '@toolpad/core/react-router';

import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";

import "./css/tailwind.css"
import "./css/styles.min.css"

// import DashboardIcon from '@mui/icons-material/Dashboard';

import MainPage from './pages/MainPage';

const theme = createTheme({
  palette: {},
});


const router = createBrowserRouter([
  {
    Component: AppContent,
    children: [
      {
        path: '/',
        Component: MainPage,
      }
    ],
  },
]);


// const BRANDING = {
//   title: 'React MUI Template',
// };

// /*
// * List of NagivationItem for Toolpad's DashboardLayout siderbar. Only
// */
// const NAVIGATION: NavigationItem[] = [
//   {
//     segment: "",
//     title: "Dashboard",
//     icon: <DashboardIcon color='primary' />
//   }
// ]

function AppContent() {
  return (
    <HeroUIProvider>
        {/* <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}    > */}
        {/* <ThemeProvider theme={{ [MATERIAL_THEME_ID]: theme }}> */}
          {/* <MaterialCssVarsProvider> */}
            {/* <DialogsProvider> */}
            {/* <CssBaseline enableColorScheme /> */}
            < Outlet />
            {/* </DialogsProvider> */}
          {/* </MaterialCssVarsProvider> */}
        {/* </ThemeProvider> */}
        {/* </ReactRouterAppProvider> */} G
    </HeroUIProvider>
  );
}

function App() {
  return (
    <RouterProvider router={router} />
  )
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
