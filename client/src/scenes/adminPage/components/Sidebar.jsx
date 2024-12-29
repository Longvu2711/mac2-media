import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const Sidebar = ({ isOpen }) => {
  const [isFolded, setIsFolded] = useState(false);

  const handleToggleFold = () => {
    setIsFolded(!isFolded);
  };

  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      sx={{ width: isFolded ? 60 : 300, flexShrink: 0 }}
    >
      <Box
        sx={{
          width: isFolded ? 60 : 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isFolded ? 'center' : 'flex-start',
          padding: 1,
        }}
      >
        <IconButton onClick={handleToggleFold}>
          {isFolded ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
        <List>
          <ListItem button>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Posts" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
