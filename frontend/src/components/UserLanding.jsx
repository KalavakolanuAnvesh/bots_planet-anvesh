import React from 'react';
import { Box, Typography, Chip, List, ListItemIcon, ListItemText, Paper, Toolbar } from '@mui/material';
import { NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CustomerSegment from './UserLandingPages/CustomerSegment';
import ProductInformation from './UserLandingPages/ProductInformation';
import BuyerProfile from './UserLandingPages/BuyerProfile';
import PotentialCustomers from './UserLandingPages/PotentialCustomers';
import PotentialBuyers from './UserLandingPages/PotentialBuyers';
import ConversationTemplates from './UserLandingPages/ConversationTemplates';
import ScheduleAppointments from './UserLandingPages/ScheduleAppointments';
import '../styles/UserLanding.css';

const menuItems = [
  { label: 'Customer Segment', icon: <GroupIcon />, manual: true, path: 'customer-segment' },
  { label: 'Product Information', icon: <CategoryIcon />, manual: true, path: 'product-information' },
  { label: 'Buyer Profile', icon: <PersonIcon />, path: 'buyer-profile' },
  { label: 'Potential Customers', icon: <PeopleAltIcon />, path: 'potential-customers' },
  { label: 'Potential Buyers', icon: <PersonSearchIcon />, path: 'potential-buyers' },
  { label: 'Conversation Templates', icon: <ListAltIcon />, path: 'conversation-templates' },
  { label: 'Schedule Appointments', icon: <CalendarTodayIcon />, path: 'schedule-appointments' },
];

const sectionComponentMap = {
  'customer-segment': <CustomerSegment />,
  'product-information': <ProductInformation />,
  'buyer-profile': <BuyerProfile />,
  'potential-customers': <PotentialCustomers />,
  'potential-buyers': <PotentialBuyers />,
  'conversation-templates': <ConversationTemplates />,
  'schedule-appointments': <ScheduleAppointments />,
};

const UserLanding = () => {
  const { section } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentSection = section || 'customer-segment';

  React.useEffect(() => {
    if (!section && location.pathname === '/userlanding') {
      navigate('/userlanding/customer-segment', { replace: true });
    }
  }, [section, location, navigate]);

  return (
    <Box className="userlanding-root">
      <Box className="userlanding-content">
        <Paper className="sidebar glassy-sidebar" elevation={2}>
          <List>
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={`/userlanding/${item.path}`}
                className={({ isActive }) =>
                  'sidebar-item' + (isActive ? ' active' : '')
                }
                end
              >
                <ListItemIcon className="sidebar-icon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {item.manual && (
                  <Chip label="Manual" size="small" color="default" className="manual-chip" />
                )}
              </NavLink>
            ))}
          </List>
        </Paper>
        <Box className="main-content highlevel-main-content">
          <Box className="main-content-inner">
            {sectionComponentMap[currentSection] || <CustomerSegment />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserLanding; 