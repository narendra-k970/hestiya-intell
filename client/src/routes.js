import React from 'react';
import { Icon } from '@chakra-ui/react';
import { MdHome, MdLock, MdDetails, MdUploadFile, MdMap } from 'react-icons/md';

// Admin & User View Imports
import MainDashboard from 'views/admin/default';
import AuthForm from 'views/auth/signUp/signup';
import Login from 'views/auth/signIn/login';
import IrecManagement from 'views/admin/irecManagement';
import UserMarketDashboard from 'views/user/marketPrice';
import MarketPricingUpload from 'views/admin/pricing';
import MarketMap from 'views/user/price-view';

const brandGreen = '#19944D';

const routes = [
  // 1. ADMIN HOME
  {
    name: 'Home',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color={brandGreen} />,
    component: <MainDashboard />,
    roles: ['admin'],
  },

  // 2. USER HOME (I-Recs ke upar le aaya)
  {
    name: 'Home',
    layout: '/user',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color={brandGreen} />,
    component: <MainDashboard />,
    roles: ['user'],
  },

  // 3. I-RECS (Dropdown Group)
  {
    name: 'I-Recs',
    isGroup: true,
    icon: (
      <Icon as={MdUploadFile} width="20px" height="20px" color={brandGreen} />
    ),
    items: [
      {
        name: 'I-REC Management',
        layout: '/admin',
        path: '/irec-management',
        component: <IrecManagement />,
        roles: ['admin'],
      },
      {
        name: 'Price Update',
        layout: '/admin',
        path: '/price-update',
        component: <MarketPricingUpload />,
        roles: ['admin'],
      },
      {
        name: 'I-Recs Plants Dashboard',
        layout: '/user',
        path: '/market-prices',
        icon: (
          <Icon as={MdDetails} width="20px" height="20px" color={brandGreen} />
        ),
        component: <UserMarketDashboard />,
        roles: ['user'],
      },
      {
        name: 'Pricing',
        layout: '/user',
        path: '/price-view',
        icon: <Icon as={MdMap} width="20px" height="20px" color={brandGreen} />,
        component: <MarketMap />,
        roles: ['user'],
      },
    ],
  },

  // 4. CARBON CREDITS (Component khali kar diya)
  {
    name: 'Carbon Credits',
    layout: '/user',
    path: '/carbon-credits',
    icon: <Icon as={MdMap} width="20px" height="20px" color={brandGreen} />,
    component: <div style={{ padding: '20px' }}>Coming Soon...</div>, // Map hata diya
    roles: ['user', 'admin'],
  },

  // --- AUTH ROUTES ---
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color={brandGreen} />,
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
