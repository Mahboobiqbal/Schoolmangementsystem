import { useEffect, useState } from 'react';
import { CircularProgress, Stack, TextField, Typography } from '@mui/material';
import Popup from '../../components/Popup';
import { BlueButton } from '../../components/buttonStyles';
import { addStuff } from '../../redux/userRelated/userHandle';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const StudentComplain = () => {
    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");

    const dispatch = useDispatch();

    const { status, currentUser, error } = useSelector(state => state.user);

    const user = currentUser._id;
    const school = currentUser.school._id;
    const address = "Complain";

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = { user, date, complaint, school };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false);
            setShowPopup(true);
            setMessage("Complain submitted successfully!");
        }
        else if (error) {
            setLoader(false);
            setShowPopup(true);
            setMessage("Network Error");
        }
    }, [status, error]);

    return (
        <>
            <StyledContainer>
                <FormCard>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#411d70", mb: 2, textAlign: "center" }}>
                        Submit a Complaint
                    </Typography>
                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Select Date"
                                type="date"
                                value={date}
                                onChange={(event) => setDate(event.target.value)}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth
                                label="Write your complaint"
                                variant="outlined"
                                value={complaint}
                                onChange={(event) => setComplaint(event.target.value)}
                                required
                                multiline
                                maxRows={4}
                            />
                            <BlueButton
                                fullWidth
                                size="large"
                                sx={{ mt: 2, fontWeight: 600, borderRadius: "1rem" }}
                                variant="contained"
                                type="submit"
                                disabled={loader}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                            </BlueButton>
                        </Stack>
                    </form>
                </FormCard>
            </StyledContainer>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default StudentComplain;

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