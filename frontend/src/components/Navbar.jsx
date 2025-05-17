import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import "../styles/Navbar.css";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          <Link to="/" className="logo">Bots Planet</Link>
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/pricing" className="nav-link">Pricing</Link>
              <Link to="/solutions" className="nav-link">Solutions</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-button">Sign Up</Link>
            </>
          )}
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {user ? (
              <>
                <MenuItem component={Link} to="/dashboard" onClick={handleClose}>Dashboard</MenuItem>
                <MenuItem component={Link} to="/login" onClick={handleClose}>Logout</MenuItem>
              </>
            ) : (
              <>
                <MenuItem component={Link} to="/pricing" onClick={handleClose}>Pricing</MenuItem>
                <MenuItem component={Link} to="/solutions" onClick={handleClose}>Solutions</MenuItem>
                <MenuItem component={Link} to="/contact" onClick={handleClose}>Contact</MenuItem>
                <MenuItem component={Link} to="/login" onClick={handleClose}>Login</MenuItem>
                <MenuItem component={Link} to="/signup" onClick={handleClose}>Sign Up</MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
