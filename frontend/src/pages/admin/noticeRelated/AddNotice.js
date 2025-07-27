import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress, TextField, Button, Stack, Typography } from '@mui/material';
import Popup from '../../../components/Popup';
import styled from 'styled-components';

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, response, error } = useSelector(state => state.user);
  const { currentUser } = useSelector(state => state.user);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const adminID = currentUser._id

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const fields = { title, details, date, adminID };
  const address = "Notice"

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === 'added') {
      navigate('/Admin/notices');
      dispatch(underControl())
    } else if (status === 'error') {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <>
      <StyledContainer>
        <FormCard>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#411d70", mb: 2, textAlign: "center" }}>
            Add Notice
          </Typography>
          <form onSubmit={submitHandler}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                variant="outlined"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Details"
                variant="outlined"
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                variant="outlined"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  borderRadius: "1rem",
                  background: "linear-gradient(90deg, #7f56da 0%, #411d70 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 16px 0 rgba(127,86,218,0.10)",
                  '&:hover': {
                    background: "linear-gradient(90deg, #411d70 0%, #7f56da 100%)",
                  }
                }}
                variant="contained"
                type="submit"
                disabled={loader}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Add'
                )}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: "1rem",
                  fontWeight: 600,
                  color: "#7f56da",
                  borderColor: "#7f56da",
                  mt: 1
                }}
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </Stack>
          </form>
        </FormCard>
      </StyledContainer>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddNotice;

const StyledContainer = styled.div`
  flex: 1 1 auto;
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 80vh;
  background: linear-gradient(120deg, #f8f9fc 0%, #e9e6f7 100%);
`;

const FormCard = styled.div`
  max-width: 500px;
  width: 100%;
  padding: 48px 2.5rem 40px;
  background: linear-gradient(120deg, #fff 80%, #f3f0fa 100%);
  box-shadow: 0 4px 24px 0 rgba(127,86,218,0.10);
  border-radius: 1.5rem;
  border: none;
`;