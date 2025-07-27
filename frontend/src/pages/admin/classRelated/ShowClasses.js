import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip, Typography, CircularProgress } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import styled from 'styled-components';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    setMessage("Sorry the delete function has been disabled for now.")
    setShowPopup(true)
    // dispatch(deleteUser(deleteID, address))
    //   .then(() => {
    //     dispatch(getAllSclasses(adminID, "Sclass"));
    //   })
  }

  const sclassColumns = [
    { id: 'name', label: 'Class Name', minWidth: 170 },
  ];

  const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
    return {
      name: sclass.sclassName,
      id: sclass._id,
    };
  });

  const SclassButtonHaver = ({ row }) => {
    const actions = [
      { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
      { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
    ];
    return (
      <ButtonContainer>
        <Tooltip title="Delete Class">
          <IconButtonStyled onClick={() => deleteHandler(row.id, "Sclass")} color="secondary">
            <DeleteIcon color="error" />
          </IconButtonStyled>
        </Tooltip>
        <BlueButton variant="contained"
          onClick={() => navigate("/Admin/classes/class/" + row.id)}>
          View
        </BlueButton>
        <ActionMenu actions={actions} />
      </ButtonContainer>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Add Students & Subjects">
            <IconButtonStyled
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Typography variant="body2" sx={{ mr: 1, fontWeight: 600, color: "#7f56da" }}>Add</Typography>
              <SpeedDialIcon />
            </IconButtonStyled>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 2,
            sx: styles.styledPaper,
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {actions.map((action, idx) => (
            <MenuItem key={idx} onClick={action.action}>
              <ListItemIcon fontSize="small">
                {action.icon}
              </ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  const actions = [
    {
      icon: <AddCardIcon color="primary" />, name: 'Add New Class',
      action: () => navigate("/Admin/addclass")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Classes',
      action: () => deleteHandler(adminID, "Sclasses")
    },
  ];

  return (
    <ClassesContainer>
      <Header>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#411d70", letterSpacing: 1 }}>
          All Classes
        </Typography>
        <GreenButton variant="contained" onClick={() => navigate("/Admin/addclass")}>
          Add Class
        </GreenButton>
      </Header>
      <Card>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            {Array.isArray(sclassesList) && sclassesList.length > 0 ? (
              <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={sclassRows} />
            ) : (
              <Typography variant="body1" sx={{ color: "#888", textAlign: "center", py: 4 }}>
                No classes found. Click "Add Class" to create your first class.
              </Typography>
            )}
            <SpeedDialTemplate actions={actions} />
          </>
        )}
      </Card>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </ClassesContainer>
  );
};

export default ShowClasses;

// Styled Components
const ClassesContainer = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 0 24px 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0 1rem;
`;

const Card = styled.div`
  background: linear-gradient(120deg, #fff 80%, #f3f0fa 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(127,86,218,0.08);
  padding: 2rem 1.5rem 2.5rem 1.5rem;
  min-height: 350px;
  position: relative;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const IconButtonStyled = styled(IconButton)`
  && {
    background: #f8f7fc;
    border-radius: 50%;
    transition: background 0.2s, box-shadow 0.2s;
    &:hover {
      background: #ede7fa;
      box-shadow: 0 2px 8px 0 rgba(127,86,218,0.10);
    }
  }
`;

const styles = {
  styledPaper: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.18))',
    mt: 1.5,
    borderRadius: '1rem',
    minWidth: 180,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  }
};