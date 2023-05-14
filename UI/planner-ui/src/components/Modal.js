import * as React from 'react';
import { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
// import ThreeDRotation from '@mui/icons-material/ThreeDRotation';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex'
};

function BasicAddModal({ formElement }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log(formElement);
  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Add
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{formElement}</Box>
      </Modal>
    </>
  );
}

const useEditModal = (Form, onEdit) => {
  const [open, setOpen] = React.useState(false);
  const dataRef = useRef(undefined);
  const handleOpen = (data) => {
    dataRef.current = data;
    setOpen(true);
  };
  const handleClose = () => {
    dataRef.current = undefined;
    setOpen(false);
  };

  const cb = (data) => {
    onEdit(data)?.then?.(() => {
      handleClose();
    });
  };
  const element = (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Form data={dataRef.current} onSubmit={cb} />
      </Box>
    </Modal>
  );
  return [element, handleOpen];
};

export { BasicAddModal, useEditModal };
