import { RootState } from '../../../helpers';
import React from 'react';
import { Navbar } from '../Navbar';


const DashboardLayout: React.FunctionComponent<Partial<RootState>> = ({ authentication, children }) => {
    return (
        <>
            <Navbar user={authentication?.user} />
            <aside className="main-sidebar sidebar-dark-primary elevation-4"></aside>
            <div className="contentWrapper">
                {children}
            </div>
        </>
    );
}

export default DashboardLayout;
