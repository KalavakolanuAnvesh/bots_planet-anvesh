import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormControlLabel,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  InputAdornment,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const DRAWER_WIDTH = 240;

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasedBots, setPurchasedBots] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User', // Default role
  });
  const [users, setUsers] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [assignedBotsCount, setAssignedBotsCount] = useState({});
  const [botLicenses, setBotLicenses] = useState({});  // Track available licenses per bot
  const [editingUser, setEditingUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [botAssignments, setBotAssignments] = useState({});
  const [manualEntryMode, setManualEntryMode] = useState(false);
  const [emptyRows, setEmptyRows] = useState(Array(10).fill({
    id: '', // Temporary or will be replaced by _id from backend
    name: '',
    email: '',
    password: '',
    role: '',
    status: 'Active'  // Added status field with default value
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Clear all user-related data if this is first time after signup
        const isNewSignup = sessionStorage.getItem('isNewSignup') === 'true';
        if (isNewSignup) {
          // Clear all user-related data
          const allKeys = Object.keys(localStorage);
          allKeys.forEach(key => {
            if (key.startsWith('users_') || key === 'users') {
              localStorage.removeItem(key);
            }
          });
          sessionStorage.removeItem('isNewSignup');
        }

        // Get admin data from localStorage
        const adminDataRaw = localStorage.getItem('adminProfile');
        if (adminDataRaw) {
          const parsedAdminData = JSON.parse(adminDataRaw);
          // Only use admin data if it matches current user
          if (parsedAdminData.email === user?.email) {
            setAdminData(parsedAdminData);
          } else {
            // Clear admin data if it doesn't match current user
            localStorage.removeItem('adminProfile');
            setAdminData(null);
          }
        }

        // Fetch bots from MongoDB
        const botsResponse = await axios.get('http://localhost:5000/api/bots');
        const botsData = botsResponse.data;

        // Get bots data from localStorage (This part might need review if bots are fully managed by backend)
        const rawData = localStorage.getItem('selectedBotsData');
        const selectedBotsData = JSON.parse(rawData || '{}');

        // Map bots fetched from backend to the purchasedBots state structure
        const purchasedBotsArray = botsData.map(bot => {
             // Default quantity if not found in localStorage
            const totalLicenses = selectedBotsData.botQuantities?.[bot.botId] || 2;

             // Initialize each bot with empty assignments
             setBotLicenses(prev => ({
                ...prev,
                [bot.botId]: {
                    total: totalLicenses,
                    assigned: 0,
                    assignments: []
                }
            }));

            return {
                id: bot.botId, // Use bot.botId from backend
                name: bot.botName, // Use bot.botName from backend
                type: bot.roleId, // Assuming roleId maps to type, adjust if needed
                totalQuantity: totalLicenses,
                assignedQuantity: 0, // This should likely come from backend or be calculated
                price: bot.cost, // Use bot.cost from backend
                status: 'inactive', // Status needs to be managed
                assignments: [], // Assignments should be fetched/managed separately
                description: bot.description,
                trial: bot.trial || false // Use trial from backend if available
            };
        });


        // Clear all assignments on mount (This might not be desired, assignments should persist)
        // localStorage.removeItem('botAssignments');
        // setBotAssignments({});

        // Initialize each bot with no assignments (This might overwrite existing assignments)
        const initialBotLicenses = {};
        purchasedBotsArray.forEach(bot => {
          // Ideally, fetch actual assigned count from backend
          initialBotLicenses[bot.id] = {
            total: bot.totalQuantity,
            assigned: 0, // This needs to be fetched or calculated from user assignments
            assignments: [] // This needs to be fetched from user assignments
          };
        });

        setBotLicenses(initialBotLicenses);
        setPurchasedBots(purchasedBotsArray);

        // Initialize users by fetching from MongoDB
        if (user?.email) {
           const usersResponse = await axios.get('http://localhost:5000/api/users');
           setUsers(usersResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error in dashboard:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email]); // Add user?.email as dependency

  // Add cleanup effect when component unmounts or user changes
  useEffect(() => {
    return () => {
      // Clear users state when unmounting or changing user
      setUsers([]);
    };
  }, [user?.email]);


  const handleLogout = async () => {
    try {
      // Clear all user-specific data before logout
      if (user?.email) {
        // Consider if you want to clear all user data on logout or just the current user's state
        // localStorage.removeItem(`users_${user.email}`);
      }
      // localStorage.removeItem('adminProfile'); // Consider if adminProfile should persist across logins for the same browser
      await logout(); // This clears the user from AuthContext and local storage
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateUser = async () => {
    // Validate required fields
    if (!newUser.name || !newUser.password || !newUser.email || !newUser.role) {
      setError('Please fill in all required fields');
      return;
    }

    // Optional: Add email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Optional: Add password complexity validation if not handled by backend schema
    if (newUser.password.length < 8) {
         setError('Password must be at least 8 characters long.');
         return;
    }


    try {
      // **CORRECT ENDPOINT FOR CREATING A REGULAR USER**
      const response = await axios.post('http://localhost:5000/api/users', {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password, // Send password, backend will handle hashing (ideally) and storage
        role: newUser.role.toLowerCase(), // Send the selected role (backend will enforce 'user' for this endpoint)
        customerId: adminData?.customer?.customerId || 'CUST-0001', // **Important:** Send the customer ID (Get from admin data)
        createdBy: user?.userId || 'ADM-0001', // **Important:** Send the ID of the admin creating the user (Get from logged-in user context)
        // Add department if needed in your user model
        // department: newUser.department
      }, {
        withCredentials: true
      });

      console.log('User creation response:', response.data);

      // Assuming the backend returns the created user object with an _id
      const createdUser = response.data;

      // Update the users state to include the new user
      setUsers(prevUsers => {
          // Find the temporary manual entry row by comparing entered details
          const index = prevUsers.findIndex(u => u.name === newUser.name && u.email === newUser.email && u.password === newUser.password);

          if (index > -1) {
               // Replace the temporary row with the actual user data from the backend
              const updated = [...prevUsers];
              // Ensure the structure matches (backend might return _id instead of id)
              updated[index] = { ...createdUser, id: createdUser._id || createdUser.id };
              return updated.filter(u => u.id !== ''); // Filter out any remaining truly empty temporary rows if needed
          } else {
               // If not found in temporary rows, just add the new user to the list,
               // filter out any truly empty temporary rows, and ensure unique keys (_id)
              const nonTemporaryUsers = prevUsers.filter(u => u.id && u.id.startsWith('TEMP_') === false && u.id !== '');
              return [...nonTemporaryUsers, { ...createdUser, id: createdUser._id || createdUser.id }];
          }
      });


      // Clear the form
      setNewUser({ name: '', email: '', password: '', role: 'User' });
      setError(''); // Clear any previous errors

    } catch (err) {
      console.error('Error creating user:', err.response?.data?.error || err.response?.data?.message || err.message);
      // Display the specific backend error message if available
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create user. Please try again.');
    }
  };


  const handleEditUser = (user) => {
    setEditingUser(user);
    // Note: Password is not pre-filled for security
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
      // Add department if needed
      // department: user.department
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Delete from backend
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        withCredentials: true
      });

      // Remove from local state
      setUsers(users.filter(u => (u._id || u.id) !== userId)); // Use _id or id depending on what backend returns

      // Update bot licenses/assignments if necessary (this logic needs to be robust)
      const updatedLicenses = { ...botLicenses };
      Object.keys(updatedLicenses).forEach(botId => {
        updatedLicenses[botId] = {
          ...updatedLicenses[botId],
          assigned: updatedLicenses[botId].assignments.includes(userId)
            ? updatedLicenses[botId].assigned - 1
            : updatedLicenses[botId].assigned,
          assignments: updatedLicenses[botId].assignments.filter(id => id !== userId)
        };
      });
       setBotLicenses(updatedLicenses); // Update state

      setError(''); // Clear any previous errors

    } catch (err) {
      console.error('Delete user error:', err.response?.data?.error || err.response?.data?.message || err.message);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    // Validation for update (similar to create)
     if (!newUser.name || !newUser.email || !newUser.role) {
      setError('Please fill in all required fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setError('Please enter a valid email address.');
      return;
      return;
    }
    // Optional: Password validation on update if new password is provided
     if (newUser.password && newUser.password.length < 8) {
         setError('New password must be at least 8 characters long.');
         return;
    }


    try {
      // Prepare updated user data
      const updatedUserData = {
        ...editingUser, // Start with existing data
        name: newUser.name,
        email: newUser.email,
        role: newUser.role.toLowerCase(), // Send lowercase role (backend enforces 'user' if needed)
        // Only include password if a new one was entered
        ...(newUser.password && { password: newUser.password }),
        // Add department if needed
        // ...(newUser.department && { department: newUser.department })
      };

      // Call backend PUT endpoint
      // Use editingUser._id if your backend uses Mongoose _id, otherwise use editingUser.id
      await axios.put(`http://localhost:5000/api/users/${editingUser._id || editingUser.id}`, updatedUserData, {
        withCredentials: true
      });

      // Update local state with the updated user
      setUsers(users.map(user =>
        (user._id || user.id) === (editingUser._id || editingUser.id) ? { ...user, ...updatedUserData } : user // Merge updated fields
      ));

      // Close dialog and clear form
      setIsEditDialogOpen(false);
      setEditingUser(null);
      setNewUser({ name: '', email: '', password: '', role: 'User' });
      setError(''); // Clear any previous errors

    } catch (err) {
       console.error('Update user error:', err.response?.data?.error || err.response?.data?.message || err.message);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update user');
    }
  };


  const handleAssignBot = async (userIds, botId) => {
    // This function needs to be updated to call a backend endpoint
    // that handles assigning bots to users.
    // You might need a PUT or POST endpoint like /api/users/:userId/assignBot
    // or /api/assignments
    setError('Bot assignment is not yet implemented with backend API'); // Placeholder error
    console.log(`Attempting to assign bot ${botId} to users: ${userIds.join(', ')}`);

    // **Temporary Placeholder Logic (Needs Backend Implementation)**
    try {
         const bot = purchasedBots.find(b => b.id === botId);
         if (!bot) throw new Error('Bot not found');

         const currentLicenses = botLicenses[botId] || { total: bot.totalQuantity, assigned: 0, assignments: [] };
         const usersToAssign = userIds.filter(userId => !currentLicenses.assignments.includes(userId));

         if (currentLicenses.assigned + usersToAssign.length > currentLicenses.total) {
             setError(`Not enough licenses for ${bot.name}. Available: ${currentLicenses.total - currentLicenses.assigned}`);
             return false;
         }

         // Update users' assignedBots array (This needs backend call)
        const updatedUsers = users.map(user => {
            if (userIds.includes(user._id || user.id)) {
                const currentAssignments = user.assignedBots || [];
                // Prevent assigning if user already has a different bot (if single assignment is rule)
                // if (currentAssignments.length > 0 && !currentAssignments.includes(botId)) {
                //     throw new Error(`User ${user.name} already has a different bot.`);
                // }
                 return {
                    ...user,
                    assignedBots: [...currentAssignments, botId] // Add the botId
                 };
            }
            return user;
        });
        setUsers(updatedUsers); // Update local state

         // Update bot licenses state (This also needs to be reflected in backend)
         const updatedLicenses = {
            ...botLicenses,
            [botId]: {
                ...currentLicenses,
                assigned: currentLicenses.assigned + usersToAssign.length,
                assignments: [...currentLicenses.assignments, ...usersToAssign]
            }
         };
         setBotLicenses(updatedLicenses); // Update local state

         setAssignmentSuccess(true);
         setError(''); // Clear error

         return true; // Indicate success locally
    } catch (error) {
        console.error('Bot assignment error:', error);
        setError(error.message);
        return false; // Indicate failure
    }
    // **End Temporary Placeholder Logic**
  };


  // This function was for the manual entry table which we are replacing/augmenting
  // with the fetched user data. This manual entry approach might be confusing
  // when integrating with a backend. Consider removing the emptyRows state and
  // simplifying the user table rendering to just map over the `users` state fetched from the backend.
  const handleManualEntry = (index, field, value) => {
    console.warn("handleManualEntry is for temporary rows and should be replaced by API calls.");
    const updatedUsers = [...users]; // Use the state that fetches from backend

    // If this is a truly empty row placeholder, add a temporary ID
    if (!updatedUsers[index] || (!updatedUsers[index].id && !updatedUsers[index]._id)) {
         // Find the corresponding empty row placeholder if it exists
         // Or decide if you want to allow adding via manual entry fields directly
         // This logic becomes complex with backend integration.
         // Suggest simplifying to using the "Add New User" dialog exclusively for creation.

         // If you must keep manual entry, you need a way to track temporary rows
         // and then submit them via the API when "Save" is clicked in the row.
         // This is a complex pattern when using a backend and might be best replaced
         // by only using the modal for user creation.

         // For now, this function is less relevant if using the Add/Edit User dialogs.
         // You might want to remove the renderUsersTable with manual entry fields
         // and replace it with a simpler display table showing users fetched from the backend.
    }
     // This logic currently modifies the `users` state which is also populated by the backend fetch.
     // This can lead to conflicts. Best to remove the manual entry row concept.
  };

  const renderDashboardContent = () => (
      <Box className="dashboard-stats">
        <Box className="stat-card">
          <Typography className="stat-title">Total Bot Licenses</Typography>
          <Typography className="stat-value">
            {purchasedBots.reduce((total, bot) => total + bot.totalQuantity, 0)}
          </Typography>
        </Box>
        <Box className="stat-card">
        <Typography className="stat-title">Active Bots</Typography>
          <Typography className="stat-value">
          {purchasedBots.filter(bot => bot.status === 'active').length}
          </Typography>
        </Box>
        <Box className="stat-card">
        <Typography className="stat-title">Total Users</Typography>
        <Typography className="stat-value">{users.length}</Typography> {/* This should now show users from MongoDB */}
        </Box>
        <Box className="stat-card">
          <Typography className="stat-title">Total Value</Typography>
          <Typography className="stat-value">
          ${purchasedBots.reduce((total, bot) => total + (bot.price * bot.totalQuantity), 0)}/mo
          </Typography>
        </Box>
      </Box>
  );

   // This table rendering needs to be updated to display users fetched from the backend.
   // Remove the manual entry logic here and simply map over the `users` state.
  const renderUsersTable = () => (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">User Management</Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          border: '2px solid #000',
          borderRadius: 1,
          maxHeight: '70vh',
          overflow: 'auto',
          '& .MuiTableCell-root': {
            border: '1px solid #000',
            padding: '8px',
            height: '52px',
            textAlign: 'center',
          },
          '& .MuiTableCell-head': {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
            position: 'sticky',
            top: 0,
            zIndex: 1
          }
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="users grid" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '60px' }}>S.No</TableCell>
              <TableCell sx={{ width: '120px' }}>User ID</TableCell>
              <TableCell sx={{ width: '200px' }}>User Name</TableCell>
              <TableCell sx={{ width: '250px' }}>Email</TableCell>
              {/* <TableCell sx={{ width: '120px' }}>Password</TableCell> // Don't display password */}
              <TableCell sx={{ width: '120px' }}>Role</TableCell>
              {/* <TableCell sx={{ width: '120px' }}>Status</TableCell> // Add status to model/display if needed */}
              <TableCell sx={{ width: '200px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
             {/* Map over the `users` state fetched from MongoDB */}
            {users.map((user, index) => (
              <TableRow
                key={user._id || user.id} // Use MongoDB _id as the key
                sx={{
                  height: '52px',
                  '& .MuiTableCell-root': {
                    backgroundColor: 'white',
                    cursor: 'text'
                  }
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.userId}</TableCell> {/* Display backend userId */}
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                 {/* <TableCell>********</TableCell> // Don't display password */}
                <TableCell>
                  <Chip
                    label={user.role} // Display role from backend
                    color={user.role === 'admin' ? 'error' : user.role === 'manager' ? 'warning' : 'primary'} // Use lowercase roles
                    size="small"
                  />
                </TableCell>
                {/* <TableCell>{user.status}</TableCell> // Display status if in model */}
                <TableCell>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                     {/* Use _id for edit/delete operations */}
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleEditUser(user)} // Pass the user object
                    >
                      Edit
                    </Button>
                     {/* Remove the manual Update button */}
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteUser(user._id || user.id)} // Pass user ID (_id)
                    >
                      Delete
                    </Button>
                     {/* Add Assign Bots button if not handled by the Edit dialog */}
                     <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleOpenAssignDialog(user)} // Pass user object
                     >
                        Assign Bots
                     </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
             {/* Remove emptyRows mapping if not using manual entry */}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="body2" color="text.secondary">
          Total Users: {users.length} {/* Show count of users from backend */}
        </Typography>
      </Box>
    </Paper>
  );


  const renderUserCreation = () => (
    <Box>
      {/* Admin Information */}
      {/* Ensure adminData is fetched and available */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Admin Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography><strong>Name:</strong> {adminData?.name || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography><strong>Email:</strong> {adminData?.email || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography><strong>Role:</strong> Administrator</Typography> {/* Assuming admin role is displayed here */}
          </Grid>
           {/* Add Customer ID if needed */}
           <Grid item xs={12} md={4}>
            <Typography><strong>Customer ID:</strong> {adminData?.customer?.customerId || 'N/A'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* User Creation Form (This is now the PRIMARY way to create users) */}
      {/* Consider making this a separate component if it gets complex */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editingUser ? 'Edit User' : 'Create New User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {editingUser ? 'Modify existing user information' : 'Fill in the details to create a new user'}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="User Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
              helperText="Enter the full name of the user"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
              helperText="Enter a valid email address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="password"
              label={editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required={!editingUser} // Password is required for creation, optional for edit
              helperText="Minimum 8 characters with letters and numbers"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                 // You can keep allowing selection here, but the backend /api/users
                 // will enforce role: 'user'. If you want to create Admins, you need
                 // a different endpoint or logic. For now, this select will only
                 // visually affect the form data before sending, the backend decides the stored role.
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                label="Role"
                startAdornment={
                  <InputAdornment position="start">
                    <BadgeIcon />
                  </InputAdornment>
                }
              >
                {/* Only show 'User' as an option if this form is only for users */}
                 {/* If you need to create Managers/Admins from here, adjust the roles array */}
                <MenuItem value="User">User</MenuItem>
                {/* <MenuItem value="Manager">Manager</MenuItem> // Example if needed */}
                {/* <MenuItem value="Admin">Admin</MenuItem> // Example if needed */}
              </Select>
              <FormHelperText>Select the user's role and permissions</FormHelperText>
            </FormControl>
          </Grid>
           {/* Add Department field if needed in your user model */}
           {/*
           <Grid item xs={12} md={6}>
               <TextField
                select
                label="Department"
                fullWidth
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                required // Make required if needed
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </TextField>
               <FormHelperText>Select the user's department</FormHelperText>
           </Grid>
           */}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          {editingUser ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateUser}
                startIcon={<SaveIcon />}
              >
                Update User
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditDialogOpen(false); // Close edit dialog
                  setEditingUser(null); // Clear editing user
                  setNewUser({ name: '', email: '', password: '', role: 'User' }); // Clear form
                   setError(''); // Clear error
                }}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateUser} // This now calls the correct endpoint
                startIcon={<PersonAddIcon />}
              >
                Create User
              </Button>
               {/* This button navigates, doesn't submit the form */}
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setCurrentView('bot-assignment')}
                startIcon={<SmartToyIcon />}
              >
                Next: Assign Bots
              </Button>
            </>
          )}
        </Box>
         {/* Display errors here */}
        {error && (
          <Alert
            severity="error"
            sx={{ mt: 2 }}
            onClose={() => setError('')}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setError('')}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}
      </Paper>

      {/* Replace the old manual entry table with the new one */}
      {renderUsersTable()} {/* This should now display users from MongoDB */}
    </Box>
  );


  const renderAssignmentDialog = () => {
    if (!selectedBot || !selectedUsers) return null; // Ensure selectedUsers is not null

    const currentAssignments = botAssignments[selectedBot.id] || [];
    const licenses = botLicenses[selectedBot.id] || { total: selectedBot.totalQuantity, assigned: 0 };
    const remainingLicenses = licenses.total - licenses.assigned;

    return (
      <Dialog
        open={assignDialogOpen}
        onClose={() => {
          setAssignDialogOpen(false);
          setSelectedUsers([]);
           setError(''); // Clear error on close
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Assign {selectedBot?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Select users to assign this bot:
            <Typography component="span" color="primary">
              {' '}({remainingLicenses} licenses available)
            </Typography>
          </Typography>
          <Grid container spacing={2}>
             {/* Ensure `users` state contains users fetched from backend */}
            {users.map((user) => {
              // Use user._id or user.id consistently
              const userId = user._id || user.id;
              const hasThisBot = user.assignedBots?.includes(selectedBot.id);
              // Check if user has *any* assigned bots that are *not* the current selected bot
              const hasOtherBot = user.assignedBots?.length > 0 && !hasThisBot;
              const isSelectable = !hasOtherBot;

              return (
                <Grid item xs={12} key={userId}> {/* Use userId as key */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: selectedUsers.includes(userId) ? 'action.selected' : 'background.paper',
                      opacity: !isSelectable ? 0.7 : 1
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedUsers.includes(userId)}
                          disabled={!isSelectable}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (selectedUsers.length >= remainingLicenses) {
                                setError(`Cannot select more users. Only ${remainingLicenses} license(s) available.`);
                                return;
                              }
                              setSelectedUsers([...selectedUsers, userId]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== userId));
                            }
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="subtitle1">{user.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user.email} - {user.role} {/* Display role from backend */}
                            {hasThisBot && (
                              <Chip
                                size="small"
                                color="primary"
                                label="Has this bot"
                                sx={{ ml: 1 }}
                              />
                            )}
                            {hasOtherBot && (
                              <Chip
                                size="small"
                                color="error"
                                label="Has different bot"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
           {/* Display assignment errors here */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAssignDialogOpen(false);
            setSelectedUsers([]);
            setError(''); // Clear error on close
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={selectedUsers.length === 0}
             // Call the assignment handler with selected user IDs and bot ID
            onClick={() => {
              const success = handleAssignBot(selectedUsers, selectedBot.id);
              if (success) { // Check the return value of handleAssignBot
                setAssignDialogOpen(false);
                setSelectedUsers([]);
                setError(''); // Clear error on success
              }
              // Note: handleAssignBot needs backend implementation to persist assignments
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    );
  };


  const renderBotAssignment = () => (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Bot Assignment</Typography>
          <Button
            variant="outlined"
            onClick={() => setCurrentView('user-creation')}
          >
            Back to User Creation
          </Button>
        </Box>

        <Grid container spacing={3}>
          {purchasedBots.map((bot) => {
            const licenses = botLicenses[bot.id] || { total: bot.totalQuantity, assigned: 0 };
            const remainingLicenses = licenses.total - licenses.assigned;
             // Filter users based on their assignedBots array from backend data
            const assignedUsers = users.filter(u => u.assignedBots?.includes(bot.id));

            return (
              <Grid item xs={12} md={4} key={bot.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>{bot.name}</Typography>
                    <Chip
                      label={bot.status === 'active' ? 'Active' : 'Inactive'}
                      color={bot.status === 'active' ? "success" : "default"}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {bot.description}
                    </Typography>
                    <Typography><strong>Bot ID:</strong> {bot.id}</Typography>
                    <Typography><strong>Role ID:</strong> {bot.type}</Typography> {/* Assuming type maps to roleId */}
                    <Typography>
                      <strong>Licenses:</strong> {licenses.assigned}/{licenses.total} used
                    </Typography>
                    <Typography color={remainingLicenses > 0 ? 'success.main' : 'error.main'}>
                      <strong>Available:</strong> {remainingLicenses}
                    </Typography>
                    <Typography><strong>Price:</strong> ${bot.price}/mo</Typography>

                    {bot.trial && (
                      <Chip
                        label="Trial Available"
                        color="success"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}

                    {assignedUsers.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" display="block">
                          <strong>Assigned to:</strong> {assignedUsers.map(u => u.name).join(', ')}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={remainingLicenses <= 0}
                      onClick={() => {
                        setSelectedBot(bot);
                         // Pre-select users already assigned to this bot
                         setSelectedUsers(assignedUsers.map(u => u._id || u.id));
                        setAssignDialogOpen(true);
                         setError(''); // Clear error when opening dialog
                      }}
                    >
                      Assign Bot {remainingLicenses > 0 ? `(${remainingLicenses} left)` : '(No licenses left)'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Submit button for assignments - needs backend implementation */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
         {/* This button's functionality needs to be implemented to save all assignments */}
        <Button
          variant="contained"
          color="primary"
          size="large"
            // onClick={handleSubmitAssignments} // This function needs to be implemented
             disabled={true} // Disable until assignment saving is implemented
        >
          Submit Assignments (Not Implemented)
        </Button>
        </Box>
      </Paper>

      {renderAssignmentDialog()}

      {/* Display errors here */}
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 8 }}>
          <List>
            <ListItem button onClick={() => setCurrentView('dashboard')}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => setCurrentView('user-creation')}>
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary="User Creation" />
            </ListItem>
            <ListItem button onClick={() => setCurrentView('bot-assignment')}>
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="Assign Bots" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {currentView === 'dashboard' && 'Dashboard Overview'}
          {currentView === 'user-creation' && 'User Creation'}
          {currentView === 'bot-assignment' && 'Bot Assignment'}
        </Typography>

        {currentView === 'dashboard' && renderDashboardContent()}
        {currentView === 'user-creation' && renderUserCreation()}
        {currentView === 'bot-assignment' && renderBotAssignment()}
      </Box>
    </Box>
  );
};

export default Dashboard;