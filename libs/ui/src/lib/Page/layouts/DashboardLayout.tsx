import React from 'react';
import { Navbar } from '../Navbar';
import { User } from '@node-api-gateway/api-interfaces';


export interface DashboardLayoutProps {
    user: User
}

export const DashboardLayout: React.FunctionComponent<DashboardLayoutProps> = ({ user, children }) => {
    return (
        <>
            <Navbar user={user} />
            <aside className="main-sidebar sidebar-dark-primary elevation-4"></aside>
            <div className="contentWrapper">
                {children}
            </div>
        </>
    );
}

export default DashboardLayout;
