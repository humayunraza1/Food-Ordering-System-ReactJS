import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
const style = {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    rowGap: '15px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderStyle: 'none',
    fontFamily: "Poppins",
    fontSize: '0.9rem',
    boxShadow: 24,
    p: 4,
};
function ModalBox({ children, open, setOpen }) {

    const handleClose = () => setOpen(false);
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    {children}
                </Box>
            </Fade>
        </Modal>
    )
}

export default ModalBox
