import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdLock,
  MdDetails,
  MdUploadFile,
  MdMap,
  MdPerson,
  MdBusinessCenter,
} from 'react-icons/md';

// Admin & User View Imports
import MainDashboard from 'views/admin/default';
import AuthForm from 'views/auth/signUp/signup';
import Login from 'views/auth/signIn/login';
import IrecManagement from 'views/admin/irecManagement';
import UserMarketDashboard from 'views/user/marketPrice';
import MarketPricingUpload from 'views/admin/pricing';
import MarketMap from 'views/user/price-view';
import UserProfile from 'views/user/profile';
import AdminUserList from 'views/admin/user/index';
import ForgotPassword from 'views/auth/forgotPassword';
import CompanyProfileUpload from 'views/admin/companyProfile';

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
  {
    name: 'Users',
    layout: '/admin',
    path: '/user',
    icon: <Icon as={MdPerson} width="20px" height="20px" color={brandGreen} />,
    component: <AdminUserList />,
    roles: ['admin'],
  },
  {
    name: 'Company Profiling',
    layout: '/admin',
    path: '/company-profile',
    icon: <Icon as={MdBusinessCenter} width="20px" height="20px" color={brandGreen} />,
    component: <CompanyProfileUpload />,
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
  {
    name: 'User Profile',
    layout: '/user',
    path: '/profile',
    icon: <Icon as={MdMap} width="20px" height="20px" color={brandGreen} />,
    component: <UserProfile />,
    roles: ['user'],
  },
  // 3. I-RECS (Dropdown Group)
  {
    name: 'I-REC',
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
        name: 'Global I-REC Intelligence',
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
    component: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#048E3D', // Aapka Brand Green color
          backgroundColor: '#F4F7FE', // Dashboard ka background color
        }}
      >
        Coming Soon...
      </div>
    ),
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
  {
    name: 'Forgot Password',
    layout: '/auth',
    path: '/forgot-password',
    component: <ForgotPassword />,
    secondary: true,
  },
];

export default routes;
