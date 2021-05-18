import React, { useState } from 'react';
import { User } from '@node-api-gateway/api-interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Navbar.scss';

interface NavbarProps {
  user: Partial<User>;
}

export const Navbar: React.FunctionComponent<NavbarProps> = ({
  user,
}: NavbarProps) => {
  const [showUserDd, setShowUserDd] = useState<boolean>(false);
  const userDdShowClass = showUserDd ? 'show' : '';
  return (
    <nav className="navbar navbar-expand navbar-white navbar-light border-bottom mb-4">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link
            className="nav-link"
            data-widget="pushmenu"
            to="#navbar"
            role="button"
          >
            <FontAwesomeIcon icon={faBars} fixedWidth />
          </Link>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        {user && (
          <li className={`nav-item dropdown ${userDdShowClass}`}>
            <button
              className="nav-link"
              data-toggle="dropdown"
              onClick={() => setShowUserDd(!showUserDd)}
            >
              <FontAwesomeIcon icon={faUserAlt} fixedWidth />
            </button>
            <div
              className={`dropdown-menu dropdown-menu-lg dropdown-menu-right ${userDdShowClass}`}
            >
              <button className="dropdown-item">Hi, {user.firstName}</button>
              <div className="dropdown-divider"></div>
              <a href="#settings" className="dropdown-item">
                <i className="fas fa-users mr-2"></i>
                Settings
              </a>
              <div className="dropdown-divider"></div>
              <a href="#logout" className="dropdown-item">
                <i className="fas fa-file mr-2"></i>
                Logout
              </a>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};
