import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleBookAgain,
  handleChangeReview,
  sendReview,
  deleteReview,
  updateReview,
} from "./bookSlice";
import { useParams } from "react-router-dom";

function BookComment({ user, book }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetReview, setTargetReview] = useState([]);
  const { review, disableButtonSend } = useSelector((state) => state.book);
  const [editReviewText, setEditReviewText] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleMoreVertClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const dispatch = useDispatch();
  const { bookId } = useParams();

  const handleMoreVertClose = () => {
    setAnchorEl(null);
  };

  const handleTextareaChange = (event) => {
    dispatch(handleChangeReview(event.target.value));
  };

  const handleSendButtonClick = async () => {
    await dispatch(sendReview(user._id, user.name, bookId, review));
    await dispatch(getSingleBookAgain(bookId, user._id));
  };

  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteReview(user._id, targetReview[0]));
    await dispatch(getSingleBookAgain(bookId, user._id));
    setAnchorEl(null);
    setDeleteModalOpen(false);
  };

  const handleOpenDeleteModal = (reviewId, comment) => {
    setDeleteModalOpen(true);
    setTargetReview([reviewId, comment]);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleEditReview = (reviewId, comment) => {
    setAnchorEl(null);
    setEditModalOpen(true);
    setTargetReview([reviewId, comment]);
    setEditReviewText(comment);
  };

  const handleUpdateReview = async () => {
    const updateData = {
      reviewId: targetReview[0],
      comment: editReviewText,
    };
    setEditModalOpen(false);
    await dispatch(updateReview(user._id, updateData));
    await dispatch(getSingleBookAgain(bookId, user._id));
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
  };

  return (
    <div>
      {user.role !== "admin" && (
        <div
          style={{
            overflowY: "scroll",
            height: "100px",
            border: "1px solid rgba(0, 0, 0, 0.3)",
          }}
        >
          {book.reviews && book.reviews.length > 0 && (
            <Paper elevation={0} sx={{ p: 0.5, opacity: 0.8 }}>
              {book.reviews.map((review, index) => (
                <Box
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "5px",
                  }}
                >
                  <Box sx={{}}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        height: 35,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        component="div"
                        style={{
                          fontSize: "12px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {review.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        component="div"
                        style={{ fontSize: "12px" }}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                          includeSeconds: true,
                        }).replace("about ", "")}
                        {user._id === review.userId && (
                          <div>
                            <Button
                              variant="text"
                              size="small"
                              sx={{
                                minWidth: 20,
                                width: 20,
                              }}
                              onClick={handleMoreVertClick}
                            >
                              <MoreVertIcon />
                            </Button>
                            <Menu
                              anchorEl={anchorEl}
                              keepMounted
                              open={Boolean(anchorEl)}
                              onClose={handleMoreVertClose}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleEditReview(review._id, review.comment)
                                }
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleOpenDeleteModal(
                                    review._id,
                                    review.comment
                                  )
                                }
                              >
                                Delete
                              </MenuItem>
                            </Menu>
                          </div>
                        )}
                      </Typography>
                    </Box>

                    <Typography
                      variant="subtitle2"
                      component="div"
                      style={{ fontSize: "12px" }}
                    >
                      {review.comment}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Box>
                </Box>
              ))}
            </Paper>
          )}
        </div>
      )}
      {user.role !== "admin" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
          }}
        >
          <textarea
            style={{
              width: "100%",
              marginRight: "5px",
              fontFamily: "Arial, sans-serif",
            }}
            value={review}
            onChange={handleTextareaChange}
          ></textarea>
          <Button
            onClick={handleSendButtonClick}
            variant="outlined"
            color="primary"
            disabled={user.role === "admin" || disableButtonSend}
          >
            send
          </Button>
        </Box>
      )}
      <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button
            onClick={() => handleDeleteReview(review._id)}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editModalOpen}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={5}
            value={editReviewText}
            onChange={(e) => setEditReviewText(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={handleCancelEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateReview} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BookComment;
