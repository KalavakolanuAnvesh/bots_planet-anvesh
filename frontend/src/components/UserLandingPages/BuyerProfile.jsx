import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Grid, 
  Typography, 
  Divider, 
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import axios from 'axios';

const BuyerProfile = () => {
  const [attributes, setAttributes] = useState({
    Country: [],
    BuyerType: [],
    Designation: [],
  });

  const [description, setDescription] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [newAttributeName, setNewAttributeName] = useState('');
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(null);
  const [botId, setBotId] = useState('');
  const [userId, setUserId] = useState('');
  const [botName, setBotName] = useState('');
  const [userName, setUserName] = useState('');

  const attributeKeys = Object.keys(attributes);

  // Fetch profiles on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/buyer-profiles')
      .then(res => setSavedProfiles(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add value to attribute
  const handleAddValue = (key) => {
    if (!newAttributeValue.trim()) return;
    setAttributes(prev => ({
      ...prev,
      [key]: [...prev[key], newAttributeValue.trim()],
    }));
    setNewAttributeValue('');
    setSelectedAttribute('');
  };

  // Delete value from attribute
  const handleDeleteValue = (key, index) => {
    setAttributes(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  // Add new attribute field
  const handleAddNewField = () => {
    if (!newAttributeName.trim()) return;
    setAttributes(prev => ({
      ...prev,
      [newAttributeName.trim()]: [],
    }));
    setNewAttributeName('');
    setShowAddFieldDialog(false);
  };

  // Save or update profile
  const handleSaveProfile = async () => {
    const profile = {
      attributes,
      description,
      assignedTo: 'bot', // or your assignment logic
    };
  
    try {
      let response;
      if (editIndex !== null && savedProfiles[editIndex]?._id) {
        // Update
        response = await axios.put(
          `http://localhost:5000/api/buyer-profiles/${savedProfiles[editIndex]._id}`,
          profile
        );
        const updated = [...savedProfiles];
        updated[editIndex] = response.data;
        setSavedProfiles(updated);
        setEditIndex(null);
      } else {
        // Create
        response = await axios.post('http://localhost:5000/api/buyer-profiles', profile);
        setSavedProfiles([...savedProfiles, response.data]);
      }
    } catch (err) {
      alert('Failed to save profile: ' + (err.response?.data?.message || err.message));
      return;
    }
  
    setAttributes({
      Country: [],
      BuyerType: [],
      Designation: [],
    });
    setDescription('');
    setSelectedAttribute('');
  };

  // Edit profile
  const handleEdit = (index) => {
    const profile = savedProfiles[index];
    setAttributes(profile.attributes);
    setDescription(profile.description);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open assignment dialog
  const handleAssignClick = (index) => {
    setSelectedProfileIndex(index);
    setShowAssignDialog(true);
  };

  // Assign profile to bot or user
  const handleAssignmentChange = (type) => {
    if (selectedProfileIndex !== null) {
      const updated = [...savedProfiles];
      let assignValue = type;
      if (type === 'bot' && botId && botName) {
        assignValue = { type: 'bot', id: botId, name: botName };
      } else if (type === 'user' && userId && userName) {
        assignValue = { type: 'user', id: userId, name: userName };
      }
      updated[selectedProfileIndex] = {
        ...updated[selectedProfileIndex],
        assignedTo: assignValue
      };
      setSavedProfiles(updated);
      setShowAssignDialog(false);
      setSelectedProfileIndex(null);
      setBotId('');
      setBotName('');
      setUserId('');
      setUserName('');
    }
  };

  // Delete profile
  const handleDeleteProfile = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/buyer-profiles/${id}`);
      setSavedProfiles(savedProfiles.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete profile');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }} color="primary">
        Buyer Profile Setup
      </Typography>

      {/* Attribute Fields */}
      <Grid container spacing={3}>
        {attributeKeys.map((key) => (
          <Grid item xs={12} md={4} key={key}>
            <Card sx={{ p: 2 }} elevation={2}>
              <Typography variant="h6" sx={{ mb: 1 }}>{key}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {attributes[key].map((val, idx) => (
                  <Chip
                    key={idx}
                    label={val}
                    onDelete={() => handleDeleteValue(key, idx)}
                  />
                ))}
              </Box>
              {selectedAttribute === key && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder={`Add ${key}`}
                    value={newAttributeValue}
                    onChange={(e) => setNewAttributeValue(e.target.value)}
                  />
                  <Button variant="contained" onClick={() => handleAddValue(key)}>
                    Add
                  </Button>
                </Box>
              )}
              <Button
                size="small"
                startIcon={<AddCircleIcon />}
                sx={{ mt: 2 }}
                onClick={() => setSelectedAttribute(key)}
              >
                Add Value
              </Button>
            </Card>
          </Grid>
        ))}

        {/* Add Field Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px dashed #90caf9',
              cursor: 'pointer',
            }}
            onClick={() => setShowAddFieldDialog(true)}
          >
            <AddCircleIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="subtitle1" color="primary">Add Field</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Description Field */}
      <Card sx={{ mt: 4, p: 3 }} elevation={3}>
        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Card>

      {/* Save Button */}
      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Button variant="contained" color="primary" onClick={handleSaveProfile}>
          {editIndex !== null ? 'Update Profile' : 'Save Profile'}
        </Button>
      </Box>

      {/* Add Field Dialog */}
      <Dialog open={showAddFieldDialog} onClose={() => setShowAddFieldDialog(false)}>
        <DialogTitle>Add New Attribute</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Attribute Name"
            fullWidth
            value={newAttributeName}
            onChange={(e) => setNewAttributeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddFieldDialog(false)}>Cancel</Button>
          <Button onClick={handleAddNewField}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Saved Profiles */}
      {savedProfiles.length > 0 && (
        <Card sx={{ mt: 5, p: 3 }} elevation={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Saved Buyer Profiles
          </Typography>
          {savedProfiles.map((profile, i) => (
            <Card key={i} sx={{ p: 2, mb: 3 }} variant="outlined">
              {Object.keys(profile.attributes).map((key) =>
                profile.attributes[key].length > 0 ? (
                  <Typography key={key} variant="body2">
                    {key}: {profile.attributes[key].join(', ')}
                  </Typography>
                ) : null
              )}
              {profile.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  📝 Description: {profile.description}
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {typeof profile.assignedTo === 'object' ? (
                  <>
                    Assigned to: {profile.assignedTo.type === 'bot' ? 'Bot' : 'User'} ({profile.assignedTo.name} - ID: {profile.assignedTo.id})
                  </>
                ) : (
                  <>Assigned to: {profile.assignedTo === 'bot' ? 'Bot' : 'User'}</>
                )}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(i)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<AssignmentIcon />}
                  onClick={() => handleAssignClick(i)}
                  color="primary"
                >
                  Assign
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteProfile(profile._id)}
                >
                  Delete
                </Button>
              </Box>
            </Card>
          ))}
        </Card>
      )}

      {/* Assignment Dialog */}
      <Dialog 
        open={showAssignDialog} 
        onClose={() => setShowAssignDialog(false)}
        PaperProps={{
          sx: {
            width: '400px',
            p: 1,
            borderRadius: '8px'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          fontWeight: 600,
          color: 'primary.main',
          pb: 1
        }}>
          Assign Profile
        </DialogTitle>
        <DialogContent sx={{ pb: 2, pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Bot Fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartToyIcon /> Bot Assignment
              </Typography>
              <TextField
                fullWidth
                label="Bot ID"
                placeholder="Enter Bot ID"
                value={botId}
                onChange={(e) => setBotId(e.target.value)}
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Bot Type"
                placeholder="Enter Bot Type"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                variant="outlined"
                required
              />
            </Box>

            <Divider />

            {/* User Fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon /> User Assignment
              </Typography>
              <TextField
                fullWidth
                label="User ID/User Name"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="User Name"
                placeholder="Enter User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                variant="outlined"
                required
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button 
            onClick={() => {
              setShowAssignDialog(false);
              setBotId('');
              setBotName('');
              setUserId('');
              setUserName('');
            }}
            variant="outlined"
            sx={{ 
              borderRadius: '8px',
              px: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (botId && botName) {
                handleAssignmentChange('bot');
              } else if (userId && userName) {
                handleAssignmentChange('user');
              }
            }}
            variant="contained"
            disabled={
              (!botId || !botName) && (!userId || !userName)
            }
            sx={{ 
              borderRadius: '8px',
              px: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BuyerProfile;