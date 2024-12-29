import React, { useState } from 'react';
import { Button, Container, Typography, TextField } from '@mui/material';

const AdminPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setIsButtonEnabled(value === '123456');
  };

  const handleButtonClick = async () => {
    try {
      if (isButtonEnabled) {
        window.location.href = 'http://localhost:3000/admin/dashboard';
      } else {
        console.error('Failed to navigate to admin dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBackButtonClick = () => {
    window.location.href = '/';
  };

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Admin Page
      </Typography>
      <TextField
        label="Enter Code"
        variant="outlined"
        type="password"
        value={inputValue}
        onChange={handleInputChange}
        style={{ marginBottom: '20px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        disabled={!isButtonEnabled}
      >
        Vào trang quản lý
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackButtonClick}
      >
        Trở lại đăng nhập
      </Button>
    </Container>
  );
};

export default AdminPage;