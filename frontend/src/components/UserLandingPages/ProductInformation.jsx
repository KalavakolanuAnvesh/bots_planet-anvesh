import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';

const categories = [
  'AI Tool',
  'Data Service',
  'Analytics',
  'Automation',
  'Integration',
  'Security',
  'Cloud Service',
  'Mobile App',
  'Web Application',
  'API Service',
  'Database',
  'DevOps Tool',
  'Testing Tool',
  'Monitoring Tool',
  'Other'
];

const statuses = ['Active', 'Coming Soon', 'Beta', 'Maintenance'];
const pricingModels = ['Flat', 'Tiered', 'Usage-based', 'Freemium', 'Custom'];

const supportLevels = ['Basic', 'Standard', 'Premium', 'Enterprise', 'Custom'];

const ProductInformation = () => {
  const [products, setProducts] = useState([]);

  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    version: '',
    status: 'Active',
    pricingModel: 'Flat',
    
    supportLevel: 'Standard',
    documents: [],
    urls: [],
  });

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      file: file
    }));
    setDocuments([...documents, ...newDocuments]);
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const handleAddUrl = () => {
    if (newUrl && !urls.includes(newUrl)) {
      setUrls([...urls, newUrl]);
      setNewUrl('');
    }
  };

  const handleDeleteUrl = (urlToDelete) => {
    setUrls(urls.filter(url => url !== urlToDelete));
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSaveProduct = () => {
    if (!form.name || !form.category || !form.version) {
      setError('Please fill in all required fields');
      return;
    }
    const productToSave = {
      ...form,
      documents,
      urls,
      id: editIndex !== null ? products[editIndex].id : Date.now(),
      assignedOrgs: form.assignedOrgs || 0,
      usageMetrics: form.usageMetrics || '',
    };
    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = productToSave;
      setProducts(updated);
      setEditIndex(null);
    } else {
      setProducts([...products, productToSave]);
    }
    setForm({
      name: '',
      category: '',
      description: '',
      version: '',
      status: 'Active',
      pricingModel: 'Flat',
      
      supportLevel: 'Standard',
      documents: [],
      urls: [],
    });
    setDocuments([]);
    setUrls([]);
    setNewUrl('');
    setError('');
  };

  const handleEditProduct = (idx) => {
    const prod = products[idx];
    setForm({ ...prod });
    setDocuments(prod.documents || []);
    setUrls(prod.urls || []);
    setEditIndex(idx);
    setError('');
  };

  const handleDeleteProduct = (idx) => {
    setProducts(products.filter((_, i) => i !== idx));
    if (editIndex === idx) {
      setEditIndex(null);
      setForm({
        name: '',
        category: '',
        description: '',
        version: '',
        status: 'Active',
        pricingModel: 'Flat',
       
        supportLevel: 'Standard',
        documents: [],
        urls: [],
      });
      setDocuments([]);
      setUrls([]);
      setNewUrl('');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="primary" sx={{ fontWeight: 700, letterSpacing: 1, mb: 3 }}>
        Product Information
      </Typography>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {editIndex !== null ? 'Edit Product' : 'Add New Product'}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Product Name *"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Category *</InputLabel>
            <Select
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
              label="Category *"
              displayEmpty
              required
            >
              <MenuItem value="" disabled>Category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Description"
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Version *"
            value={form.version}
            onChange={e => handleChange('version', e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Status</InputLabel>
            <Select
              value={form.status}
              onChange={e => handleChange('status', e.target.value)}
              label="Status"
              displayEmpty
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Pricing Model</InputLabel>
            <Select
              value={form.pricingModel}
              onChange={e => handleChange('pricingModel', e.target.value)}
              label="Pricing Model"
              displayEmpty
            >
              {pricingModels.map((model) => (
                <MenuItem key={model} value={model}>{model}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Support Level</InputLabel>
            <Select
              value={form.supportLevel}
              onChange={e => handleChange('supportLevel', e.target.value)}
              label="Support Level"
              displayEmpty
            >
              {supportLevels.map((level) => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" gutterBottom>Supporting Documents</Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Upload Documents
            <input
              type="file"
              multiple
              hidden
              onChange={handleFileUpload}
            />
          </Button>
          {documents.length > 0 && (
            <Stack spacing={1}>
              {documents.map((doc) => (
                <Chip
                  key={doc.id}
                  label={doc.name}
                  onDelete={() => handleDeleteDocument(doc.id)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle2" gutterBottom>Reference URLs</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={10}>
              <TextField
                fullWidth
                label="Add URL"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                placeholder="https://example.com"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<LinkIcon />}
                onClick={handleAddUrl}
              >
                Add URL
              </Button>
            </Grid>
          </Grid>
          {urls.length > 0 && (
            <Stack spacing={1} sx={{ mt: 2 }}>
              {urls.map((url) => (
                <Chip
                  key={url}
                  label={url}
                  onDelete={() => handleDeleteUrl(url)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button variant="contained" color="primary" onClick={handleSaveProduct}>
          {editIndex !== null ? 'Save Changes' : 'Add Product'}
        </Button>
        <Button variant="outlined" onClick={() => {
          setEditIndex(null);
          setForm({
            name: '',
            category: '',
            description: '',
            version: '',
            status: 'Active',
            pricingModel: 'Flat',
           
            supportLevel: 'Standard',
            documents: [],
            urls: [],
          });
          setDocuments([]);
          setUrls([]);
          setNewUrl('');
          setError('');
        }}>
          Cancel
        </Button>
      </Box>
      {/* Product List Below */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Product List
      </Typography>
      {products.length === 0 ? (
        <Typography color="text.secondary">No products added yet.</Typography>
      ) : (
        <Box>
          {products.map((product, idx) => (
            <Paper key={product.id} elevation={2} sx={{ mb: 2, p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{product.category}</Typography>
                  <Typography variant="body2">Version: {product.version}</Typography>
                  <Chip label={product.status} color={product.status === 'Active' ? 'success' : 'default'} size="small" sx={{ mt: 1 }} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2">Pricing: {product.pricingModel}</Typography>
                  
                  <Typography variant="body2">Support: {product.supportLevel}</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2">Description: {product.description}</Typography>
                  <Typography variant="body2">Assigned Orgs: {product.assignedOrgs}</Typography>
                  <Typography variant="body2">Usage: {product.usageMetrics}</Typography>
                </Grid>
                <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleEditProduct(idx)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" variant="outlined" onClick={() => handleDeleteProduct(idx)}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductInformation; 