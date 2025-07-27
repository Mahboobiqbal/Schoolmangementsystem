import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Box, IconButton, CircularProgress, Typography
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';
import { GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import styled from 'styled-components';

const ShowNotices = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllNotices(currentUser._id, "Notice"));
            })
    }

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const noticeRows = noticesList && noticesList.length > 0 && noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    });

    const NoticeButtonHaver = ({ row }) => (
        <IconButtonStyled onClick={() => deleteHandler(row.id, "Notice")}>
            <DeleteIcon color="error" />
        </IconButtonStyled>
    );

    const actions = [
        {
            icon: <NoteAddIcon color="primary" />, name: 'Add New Notice',
            action: () => navigate("/Admin/addnotice")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Notices',
            action: () => deleteHandler(currentUser._id, "Notices")
        }
    ];

    return (
        <NoticesContainer>
            <Header>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#411d70", letterSpacing: 1 }}>
                    All Notices
                </Typography>
                <GreenButton variant="contained" onClick={() => navigate("/Admin/addnotice")}>
                    Add Notice
                </GreenButton>
            </Header>
            <Card>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <>
                        {Array.isArray(noticesList) && noticesList.length > 0 ? (
                            <TableTemplate buttonHaver={NoticeButtonHaver} columns={noticeColumns} rows={noticeRows} />
                        ) : (
                            <Typography variant="body1" sx={{ color: "#888", textAlign: "center", py: 4 }}>
                                No notices found. Click "Add Notice" to create your first notice.
                            </Typography>
                        )}
                        <SpeedDialTemplate actions={actions} />
                    </>
                )}
            </Card>
        </NoticesContainer>
    );
};

export default ShowNotices;

// --- Styled Components ---
const NoticesContainer = styled.div`
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