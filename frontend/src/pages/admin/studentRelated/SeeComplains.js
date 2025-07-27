import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper, Box, Checkbox
} from '@mui/material';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate';
import styled from 'styled-components';

const SeeComplains = () => {

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const complainColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'complaint', label: 'Complaint', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
  ];

  const complainRows = complainsList && complainsList.length > 0 && complainsList.map((complain) => {
    const date = new Date(complain.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
    return {
      user: complain.user.name,
      complaint: complain.complaint,
      date: dateString,
      id: complain._id,
    };
  });

  const ComplainButtonHaver = ({ row }) => {
    return (
      <>
        <Checkbox {...label} />
      </>
    );
  };

  return (
    <ComplainsContainer>
      <Header>
        <h2>Complaints</h2>
      </Header>
      <Card>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {response ? (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                No Complaints Right Now
              </Box>
            ) : (
              Array.isArray(complainsList) && complainsList.length > 0 &&
                <TableTemplate buttonHaver={ComplainButtonHaver} columns={complainColumns} rows={complainRows} />
            )}
          </>
        )}
      </Card>
    </ComplainsContainer>
  );
};

export default SeeComplains;

// --- Styled Components ---
const ComplainsContainer = styled.div`
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
  h2 {
    font-weight: 700;
    color: #411d70;
    letter-spacing: 1px;
    margin: 0;
  }
`;

const Card = styled.div`
  background: linear-gradient(120deg, #fff 80%, #f3f0fa 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(127,86,218,0.08);
  padding: 2rem 1.5rem 2.5rem 1.5rem;
  min-height: 350px;
  position: relative;
`;