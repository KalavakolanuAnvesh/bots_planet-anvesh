import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const roles = ['Admin', 'Manager', 'User'];
const departments = ['Sales', 'Marketing', 'Content', 'Support'];

const UserManagement = ({ purchasedBots }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    department: '',
    assignedBots: [],
  });

  // Load users from MongoDB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users');
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  // Save users to MongoDB
  const saveUser = async (userData, isEdit = false) => {
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/users/${userData._id}`, userData);
      } else {
        await axios.post('http://localhost:5000/api/users', userData);
      }
      // Refresh users
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to save user');
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setFormData(user);
      setSelectedUser(user);
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'User',
        department: '',
        assignedBots: [],
      });
      setSelectedUser(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
    setSelectedUser(null);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.role || !formData.department) {
      setError('Please fill in all required fields');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    // Check for duplicate email
    const emailExists = users.some(u => u.email === formData.email && (!selectedUser || u._id !== selectedUser._id));
    if (emailExists) {
      setError('A user with this email already exists');
      return;
    }
    await saveUser(formData, !!selectedUser);
    handleCloseDialog();
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleOpenAssignDialog = (user) => {
    setSelectedUser(user);
    setOpenAssignDialog(true);
  };

  const handleAssignBot = async (botId) => {
    if (!selectedUser) return;
    const updatedUser = {
      ...selectedUser,
      assignedBots: selectedUser.assignedBots?.includes(botId)
        ? selectedUser.assignedBots
        : [...(selectedUser.assignedBots || []), botId],
    };
    await saveUser(updatedUser, true);
    setOpenAssignDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New User
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Assigned Bots</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === 'Admin' ? 'error' : user.role === 'Manager' ? 'warning' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      {(user.assignedBots || []).map((botId) => {
                        const bot = purchasedBots.find(b => b.id === botId);
                        return bot ? (
                          <Chip
                            key={botId}
                            label={bot.name}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ) : null;
                      })}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit User">
                        <IconButton size="small" onClick={() => handleOpenDialog(user)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Assign Bots">
                        <IconButton size="small" onClick={() => handleOpenAssignDialog(user)}>
                          <AssignmentIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton size="small" color="error" onClick={() => handleDeleteUser(user._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Create/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              select
              label="Role"
              fullWidth
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Department"
              fullWidth
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </TextField>
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Bots Dialog */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Bots to {selectedUser?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              {purchasedBots.map((bot) => {
                const isAssigned = selectedUser?.assignedBots?.includes(bot.id);
                return (
                  <Grid item xs={12} sm={6} key={bot.id}>
                    <Card variant={isAssigned ? 'elevation' : 'outlined'}>
                      <CardContent>
                        <Typography variant="h6">{bot.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Type: {bot.type}
                        </Typography>
                        <Button
                          variant={isAssigned ? 'contained' : 'outlined'}
                          color={isAssigned ? 'primary' : 'inherit'}
                          onClick={() => handleAssignBot(bot.id)}
                          fullWidth
                          sx={{ mt: 1 }}
                        >
                          {isAssigned ? 'Assigned' : 'Assign'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 