import * as React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Box } from '@mui/material';

export default function Layout() {
    const location = useLocation();

    const toolbarActions = () => {
        return (
            <>
                {/* <ThemeSwitcher /> */}
                {/* <span>Toolbar Action 1</span> */}
                {/* <span>Toolbar Action 2</span> */}
            </>
        )
    }

    const toolbarAccount = () => {
        return (
            <>
                {/* <ThemeSwitcher /> */}
                {/* <span>Toolbar Action 1</span> */}
                {/* <span>Toolbar Action 2</span> */}
                {/* <SignOutButton /> */}
                {/* <SignInButton /> */}
            </>
        )
    }

    return (

        <DashboardLayout slots={{
            toolbarActions,
            // toolbarAccount
        }}

        sidebarExpandedWidth={"240px"}


        >
            <Box
                sx={{
                    padding: 1,
                    height: "100%"
                }}>
                <Outlet />
            </Box>
        </DashboardLayout>
    );
}