// src/User.jsx
import { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import LockResetIcon from "@mui/icons-material/LockReset";

const API_URL = import.meta.env.VITE_API_URL;

export default function User() {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const newPassword = useRef(null);
  const isInit = useRef(false);

  const cols = [
    { field: "username", headerName: "Username", flex: 2 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "firstname", headerName: "First Name", flex: 2 },
    { field: "lastname", headerName: "Last Name", flex: 2 },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setTargetUserId(params.row._id);
            setErrorMsg("");
            setOpenDialog(true);
          }}
        >
          <LockResetIcon color="primary" />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    if (isInit.current) return;
    isInit.current = true;
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await fetch(`${API_URL}/api/user`, {
      credentials: "include",
    });
    if (result.ok) {
      const data = await result.json();
      setUsers(data.users);
    }
  };

  const closeDialog = () => {
    newPassword.current.value = "";
    setTargetUserId(null);
    setOpenDialog(false);
  };

  const onChangePassword = async () => {
    const password = newPassword.current.value;
    if (!password) {
      setErrorMsg("Password is required");
      return;
    }
    const result = await fetch(`${API_URL}/api/user/${targetUserId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (result.ok) {
      closeDialog();
    } else {
      const err = await result.json();
      setErrorMsg(err.message || "Failed to update password");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-1">
        <Typography variant="h6">Users</Typography>
      </div>
      <DataGrid rows={users} columns={cols} getRowId={(row) => row._id} />

      <Dialog open={openDialog} onClose={closeDialog} fullWidth>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            <Typography variant="h6">Change Password</Typography>
          </DialogContentText>
          <TextField
            required
            fullWidth
            type="password"
            id="new-password"
            label="New Password"
            inputRef={newPassword}
          />
          {errorMsg && (
            <Typography color="error" sx={{ mt: 1 }}>
              {errorMsg}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={onChangePassword}>
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}