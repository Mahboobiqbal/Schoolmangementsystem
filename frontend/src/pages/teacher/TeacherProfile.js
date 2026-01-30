import React from "react";
import styled from "styled-components";
import { Card, CardContent, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const FacultyProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const facultyProgram = currentUser.teachSclass;
  const facultyModule = currentUser.teachSubject;
  const facultyInstitution = currentUser.school;

  return (
    <>
      <ProfileCard>
        <ProfileCardContent>
          <ProfileText>Name: {currentUser.name}</ProfileText>
          <ProfileText>Email: {currentUser.email}</ProfileText>
          <ProfileText>Program: {facultyProgram.sclassName}</ProfileText>
          <ProfileText>Module: {facultyModule.subName}</ProfileText>
          <ProfileText>
            Institution: {facultyInstitution.schoolName}
          </ProfileText>
        </ProfileCardContent>
      </ProfileCard>
    </>
  );
};

export default FacultyProfile;

const ProfileCard = styled(Card)`
  margin: 20px;
  width: 400px;
  border-radius: 10px;
`;

const ProfileCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileText = styled(Typography)`
  margin: 10px;
`;
