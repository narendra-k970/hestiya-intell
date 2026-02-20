import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdLock,
  MdPriceCheck,
  MdDetails,
  MdUploadFile,
  MdMap,
} from 'react-icons/md';

// Admin & User View Imports
import MainDashboard from 'views/admin/default';
import AuthForm from 'views/auth/signUp/signup';
import Login from 'views/auth/signIn/login';
import IrecManagement from 'views/admin/irecManagement';
import UserMarketDashboard from 'views/user/marketPrice';
import MarketPricingUpload from 'views/admin/pricing';
import MarketMap from 'views/user/price-view';

const routes = [
  // --- ADMIN ONLY ROUTES ---
  {
    name: 'Admin Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    roles: ['admin'],
  },
  {
    name: 'I-REC Management',
    layout: '/admin',
    path: '/irec-management',
    icon: <Icon as={MdUploadFile} width="20px" height="20px" color="inherit" />,
    component: <IrecManagement />,
    roles: ['admin'],
  },
  {
    name: 'Price Update',
    layout: '/admin',
    path: '/price-update',
    icon: <Icon as={MdPriceCheck} width="20px" height="20px" color="inherit" />,
    component: <MarketPricingUpload />,
    roles: ['admin'],
  },

  // --- USER ONLY / SHARED ROUTES (Layout changed to /user) ---
  {
    name: 'User Dashboard',
    layout: '/user',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />, // Aap yahan user ka specific dashboard laga sakte hain
    roles: ['user'],
  },
  {
    name: 'I-Recs Details',
    layout: '/user',
    path: '/market-prices',
    icon: <Icon as={MdDetails} width="20px" height="20px" color="inherit" />,
    component: <UserMarketDashboard />,
    roles: ['user', 'admin'],
  },
  {
    name: 'Pricing',
    layout: '/user',
    path: '/price-view',
    icon: <Icon as={MdMap} width="20px" height="20px" color="inherit" />,
    component: <MarketMap />,
    roles: ['user', 'admin'],
  },

  // --- AUTH ROUTES ---
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <Login />,
  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/sign-up',
    component: <AuthForm />,
    secondary: true,
  },
];

export default routes;
