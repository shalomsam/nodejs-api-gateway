import React, { useState } from 'react';
import { User } from 'models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faBars } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
    user: Partial<User>;
}

export const Navbar: React.FunctionComponent<NavbarProps> = ({ user }: NavbarProps) => {
    const [ showUserDd, setShowUserDd ] = useState<boolean>(false);
    const userDdShowClass = showUserDd ? 'show' : '';
    return (
        <nav className="navbar navbar-expand navbar-white navbar-light border-bottom mb-4">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button">
                        <FontAwesomeIcon icon={faBars} fixedWidth />
                    </a>
                </li>
            </ul>

            <ul className="navbar-nav ml-auto">
                {user && (<li className={`nav-item dropdown ${userDdShowClass}`}>
                    <a
                        className="nav-link"
                        data-toggle="dropdown"
                        href="#"
                        onClick={() => setShowUserDd(!showUserDd)}
                    >
                        <FontAwesomeIcon icon={faUserAlt} fixedWidth />
                    </a>
                    <div className={`dropdown-menu dropdown-menu-lg dropdown-menu-right ${userDdShowClass}`}>
                        <a href="#" className="dropdown-item">
                            Hi, {user.firstName}
                        </a>
                        <div className="dropdown-divider"></div>
                        <a href="#" className="dropdown-item">
                            <i className="fas fa-users mr-2"></i>
                            Settings
                        </a>
                        <div className="dropdown-divider"></div>
                        <a href="#" className="dropdown-item">
                            <i className="fas fa-file mr-2"></i>
                            Logout
                        </a>
                    </div>
                </li>)}
            </ul>
        </nav>
    )
}
