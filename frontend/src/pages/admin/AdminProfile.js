// import React, { useState } from 'react';
// import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
// import { useDispatch, useSelector } from 'react-redux';
// import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
// import { useNavigate } from 'react-router-dom'
// import { authLogout } from '../../redux/userRelated/userSlice';
// import { Button, Collapse } from '@mui/material';

import { useSelector } from 'react-redux';
import { Avatar, Typography, Box } from '@mui/material';
import styled from 'styled-components';

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <ProfileContainer>
            <ProfileCard>
                <AvatarStyled>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
                </AvatarStyled>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#411d70", mb: 1 }}>
                    {currentUser.name}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#7f56da", mb: 2 }}>
                    {currentUser.schoolName}
                </Typography>
                <InfoBox>
                    <Label>Email:</Label>
                    <Value>{currentUser.email}</Value>
                </InfoBox>
                <InfoBox>
                    <Label>School:</Label>
                    <Value>{currentUser.schoolName}</Value>
                </InfoBox>
                {/* Add edit/delete buttons here if needed */}
            </ProfileCard>
        </ProfileContainer>
    );
};

export default AdminProfile;

// --- Styled Components ---
const ProfileContainer = styled.div`
  width: 100%;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f8f9fc 0%, #e9e6f7 100%);
`;

const ProfileCard = styled(Box)`
  background: linear-gradient(120deg, #fff 80%, #f3f0fa 100%);
  box-shadow: 0 4px 24px 0 rgba(127,86,218,0.10);
  border-radius: 1.5rem;
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  min-width: 340px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarStyled = styled(Avatar)`
  && {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #7f56da 60%, #411d70 100%);
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 12px 0 rgba(127,86,218,0.15);
  }
`;

const InfoBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
`;

const Label = styled(Typography).attrs({ variant: "body2" })`
  && {
    color: #7f56da;
    font-weight: 600;
    min-width: 70px;
    margin-right: 8px;
  }
`;

const Value = styled(Typography).attrs({ variant: "body2" })`
  && {
    color: #333;
    font-weight: 500;
    word-break: break-all;
  }
`;