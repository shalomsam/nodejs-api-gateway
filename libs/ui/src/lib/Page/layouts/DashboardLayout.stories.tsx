import { Roles, User } from '@node-api-gateway/api-interfaces';
import React from 'react';
import { DashboardLayout } from './DashboardLayout';

export default {
  component: DashboardLayout,
  title: 'DashboardLayout',
};

const mockUser: User = {
  firstName: 'testFirst',
  lastName: 'testLast',
  email: 'test@test.com',
  password: 'password',
  resetToken: 'string',
  resetTokenExpires: 2,
  providerId: 'string',
  provider: 'string',
  role: Roles.Admin
}

export const primary = () => {
  return <DashboardLayout user={mockUser} />;
};
