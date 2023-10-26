import { Avatar, Button, Divider, TextField, Tooltip } from "@mui/material";
import styles from "./settings.module.css";
import Stack from '@mui/system/Stack';
import EditIcon from '@mui/icons-material/Edit';
import { useRef, useState } from "react";
import ModalBox from "./Modal";
function Settings({ user }) {
    const { FULLNAME, EMAIL, ADDRESS, PHONE_NUMBER } = user
    const [open, setOpen] = useState(false);
    const [fullname, setName] = useState('');
    const handleOpen = () => setOpen(true);

    function changeName() {
        return <ModalBox open={open} setOpen={setOpen}>
            <h2>Change Name</h2>
            <TextField type="text" value={fullname} color="secondary" id="filled-basic" label="Name" variant="filled" onChange={(e) => setName(e.target.value)} />
            <Button variant="contained" color="secondary" onClick={() => setOpen(false)}>Confirm</Button>
        </ModalBox>

    }

    return (
        <>
            {changeName()}
            <div className={styles.settingsContainer}>
                <div className={styles.avatarBox}>

                    <Avatar sx={{ height: '200px', width: '200px', fontSize: '3.5rem' }} alt={FULLNAME.toUpperCase()} src="/static/images/avatar/2.jpg" />
                    <h1>{FULLNAME}</h1>
                </div>
                <Divider sx={{ width: '100%' }} />
                <div className={styles.sboxContainer}>
                    <Stack spacing={3} sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                        <div className={styles.sbox}>
                            <h1>Information</h1>
                            <div className={styles.items}>
                                <label><span>Name:</span> {FULLNAME}</label>
                                <Tooltip title='Change name' placement="right">
                                    <Button color="secondary" endIcon={<EditIcon />} onClick={handleOpen}></Button>
                                </Tooltip>
                            </div>
                            <div className={styles.items}>
                                <label><span>Email:</span> {EMAIL}</label>
                                <Tooltip title='Change email' placement="right">
                                    <Button color="secondary" endIcon={<EditIcon />} disabled></Button>
                                </Tooltip>
                            </div>
                            <div className={styles.items}>
                                <label><span>Ph#:</span> {PHONE_NUMBER}</label>
                                <Tooltip title="Change number" placement="right">
                                    <Button color="secondary" endIcon={<EditIcon />}></Button>
                                </Tooltip>
                            </div>
                            <div className={styles.items}>
                                <label><span>Address:</span> {ADDRESS}</label>
                                <Tooltip title='Change address' placement="right">
                                    <Button color="secondary" endIcon={<EditIcon />}></Button>
                                </Tooltip>
                            </div>
                        </div>
                        <div className={styles.sbox}>
                            <h1>Security</h1>
                            <div className={styles.items}>
                                <label><span>Password</span></label>
                                <Tooltip title='Change password' placement="right">
                                    <Button color="secondary" endIcon={<EditIcon />}></Button>
                                </Tooltip>
                            </div>
                        </div>
                    </Stack>
                </div>
            </div>
        </>
    )
}


export default Settings
