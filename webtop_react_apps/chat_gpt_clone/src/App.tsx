import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from 'react-router';
import type { Navigation, Session } from '@toolpad/core/AppProvider';
import { createTheme } from '@mui/material';
import { Chat } from '@mui/icons-material';


const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const NAVIGATION: Navigation = [
    // {
    //   kind: 'header',
    //   title: 'Main items',
    // },
    {
        segment: 'chat_gpt_clone/dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'chat_gpt_clone',
        title: 'Chat',
        icon: <Chat />,
    },
];


const BRANDING = {
    title: 'ChatGPT Clone',
};


export default function App() {
    return (
        <ReactRouterAppProvider
            navigation={NAVIGATION}
            branding={BRANDING}
            theme={theme}
        >
            <Outlet />
        </ReactRouterAppProvider>
    );
}