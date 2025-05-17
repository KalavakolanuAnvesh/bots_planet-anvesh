import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import axios from 'axios';

const CustomerSegment = () => {
  const [segmentationName, setSegmentationName] = useState('');
  const [attributes, setAttributes] = useState({
    Country: [],
    Industry: [],
    CompanySize: [],
    Turnover: [],
    CustomerType: [],
  });
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [segments, setSegments] = useState([]);
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [customAssignment, setCustomAssignment] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState('');

  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(null);
  const [assignmentType, setAssignmentType] = useState('bot');
  const [botId, setBotId] = useState('');
  const [userId, setUserId] = useState('');
  const [botName, setBotName] = useState('');
  const [userName, setUserName] = useState('');

  const attributeKeys = Object.keys(attributes);

  const handleAddValue = (key) => {
    if (newAttributeValue.trim() === '') return;
    setAttributes((prev) => ({
      ...prev,
      [key]: [...prev[key], newAttributeValue.trim()],
    }));
    setNewAttributeValue('');
  };

  const handleDeleteAttributeValue = (key, index) => {
    setAttributes((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const isFormValid = () => {
    if (!segmentationName.trim()) return false;
    const hasValues = Object.values(attributes).some((arr) => arr.length > 0);
    return hasValues;
  };

  const handleSaveSegment = async () => {
    if (!isFormValid()) {
      alert('Please provide Segmentation Name and add at least one attribute.');
      return;
    }

    const newSegment = {
      segmentationName,
      attributes,
      description,
      assignedTo: 'bot', // Default assignment
    };

    try {
      const response = await axios.post('http://localhost:5000/api/customer-segments', newSegment);
      console.log('Segment saved:', response.data);

      if (editIndex !== null) {
        const updated = [...segments];
        updated[editIndex] = response.data;
        setSegments(updated);
        setEditIndex(null);
      } else {
        setSegments([...segments, response.data]);
      }
    } catch (error) {
      alert('Failed to save segment: ' + (error.response?.data?.message || error.message));
      return;
    }

    setSegmentationName('');
    setAttributes({
      Country: [],
      Industry: [],
      CompanySize: [],
      Turnover: [],
      CustomerType: [],
    });
    setDescription('');
    setSelectedAttribute('');
  };

  const handleEdit = (index) => {
    const seg = segments[index];
    setSegmentationName(seg.segmentationName);
    setAttributes(seg.attributes);
    setDescription(seg.description);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddAttributeType = () => {
    if (!newAttributeName.trim()) return;
    const cleanName = newAttributeName.trim();
    if (attributes[cleanName]) {
      alert('Attribute already exists!');
      return;
    }
    setAttributes({ ...attributes, [cleanName]: [] });
    setNewAttributeName('');
    setOpenDialog(false);
  };

  const handleAssignClick = (index) => {
    setSelectedSegmentIndex(index);
    setShowAssignDialog(true);
  };

  const handleAssignmentChange = (newValue) => {
    if (selectedSegmentIndex !== null) {
      const updated = [...segments];
      let assignValue = newValue;
      
      if (assignmentType === 'bot' && botId && botName) {
        assignValue = { type: 'bot', id: botId, name: botName };
      } else if (assignmentType === 'user' && userId && userName) {
        assignValue = { type: 'user', id: userId, name: userName };
      }

      updated[selectedSegmentIndex] = {
        ...updated[selectedSegmentIndex],
        assignedTo: assignValue
      };
      setSegments(updated);
      setShowAssignDialog(false);
      setSelectedSegmentIndex(null);
      setBotId('');
      setBotName('');
      setUserId('');
      setUserName('');
      setAssignmentType('bot');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }} color="primary">
        Customer Segment Setup
      </Typography>

      <Card sx={{ p: 3, mb: 3 }} elevation={3}>
        <TextField
          fullWidth
          label="Segmentation Name"
          value={segmentationName}
          onChange={(e) => setSegmentationName(e.target.value)}
        />
      </Card>

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
                    onDelete={() => handleDeleteAttributeValue(key, idx)}
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
            onClick={() => setOpenDialog(true)}
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
        <Button variant="contained" color="primary" onClick={handleSaveSegment}>
          {editIndex !== null ? 'Update Segment' : 'Save Segment'}
        </Button>
      </Box>

      {/* Add Field Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAttributeType}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Saved Segments */}
      {segments.length > 0 && (
        <Card sx={{ mt: 5, p: 3 }} elevation={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Saved Segments
          </Typography>
          {segments.map((seg, i) => (
            <Card key={i} sx={{ p: 2, mb: 3 }} variant="outlined">
              <Typography variant="subtitle1" gutterBottom>
                {seg.segmentationName}
              </Typography>
              {Object.keys(seg.attributes).map((key) =>
                seg.attributes[key].length > 0 ? (
                  <Typography key={key} variant="body2">
                    {key}: {seg.attributes[key].join(', ')}
                  </Typography>
                ) : null
              )}
              {seg.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  📝 Description: {seg.description}
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {typeof seg.assignedTo === 'object' ? (
                  <>
                    Assigned to: {seg.assignedTo.type === 'bot' ? 'Bot' : 'User'} ({seg.assignedTo.name} - ID: {seg.assignedTo.id})
                  </>
                ) : (
                  <>Assigned to: {seg.assignedTo === 'bot' ? 'Bot' : 'User'}</>
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
          Assign Segment
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

export default CustomerSegment;