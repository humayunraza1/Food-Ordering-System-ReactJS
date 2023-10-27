import { Avatar, Button, Divider, FormControl, Input, InputAdornment, InputLabel, TextField, Tooltip } from "@mui/material";
import styles from "./settings.module.css";
import Stack from '@mui/system/Stack';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { updateUserAddress, updateUserName, updateUserNumber, updateUserPassword } from "../actions/updateUserActions";
import LockIcon from '@mui/icons-material/Lock';
import ModalBox from "./Modal";
import IconButton from '@mui/material/IconButton';
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import AlertBar from "./AlertBar";
import { useNavigate } from "react-router-dom";


const token = sessionStorage.getItem('authToken');

let validNumber = false;
function isValidNumber(number) {
    let nums = number.toString();
    if (nums.length === 11) {
        validNumber = true;
    } else {
        validNumber = false
    }
    console.log(nums.length)
    return validNumber;
}


function Settings({ user }) {
    const { FULLNAME, EMAIL, ADDRESS, PHONE_NUMBER } = user
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [fullname, setName] = useState('');
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState({ status: 'success', msg: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState([false, false]);
    const [number, setNumber] = useState(0);
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState({ oldpassword: '', newpassword: '' })
    const togglePasswordVisibility = (index) => {
        // Create a copy of the current showPassword state array
        const newShowPassword = [...showPassword];

        // Toggle the value at the specified index
        newShowPassword[index] = !newShowPassword[index];

        // Update the state with the new array
        setShowPassword(newShowPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const label = ['old passowrd', 'new password'];
    const dispatch = useDispatch();
    // const updateUser = useSelector(state => state.updateUser.user);
    function changeName() {
        return <ModalBox open={true} setOpen={setOpen}>
            {show && <AlertBar status={status.status} msg={status.msg} />}

            <h2>Change Name</h2>
            <TextField type="text" value={fullname} color="secondary" id="filled-basic" label="Name" variant="filled" disabled={loading} onChange={(e) => setName(e.target.value)} />
            <Button variant="contained" color="secondary" disabled={loading} onClick={() => {
                handleChangeName();
                setOpen('cname')
            }}>Confirm</Button>
        </ModalBox>

    }

    function changeAddress() {
        return <ModalBox open={true} setOpen={setOpen} >
            {show && <AlertBar status={status.status} msg={status.msg} />}

            <h2>Change Name</h2>
            <TextField type="text" value={fullname} color="secondary" id="filled-basic" label="Name" variant="filled" disabled={loading} onChange={(e) => setAddress(e.target.value)} />
            <Button disabled={loading} variant="contained" color="secondary" onClick={() => {
                handleChangeAddress();
                setOpen('cname')
            }}>Confirm</Button>
        </ModalBox>

    }

    function changeNumber() {
        return <ModalBox open={true} setOpen={setOpen} >
            {show && <AlertBar status={status.status} msg={status.msg} />}

            <h2>Change Name</h2>
            <TextField type="text" value={number} color="secondary" id="filled-basic" label="Number" variant="filled" onChange={(e) => setNumber(e.target.value)} disabled={loading} />
            {isValidNumber(number) && <Button variant="contained" color="secondary" disabled={loading} onClick={() => {
                handleChangeNumber();
                setOpen('cnumber')
            }}>Confirm</Button>}
        </ModalBox>

    }


    function changePassword() {
        return <ModalBox open={true} setOpen={setOpen} >
            {show && <AlertBar status={status.status} msg={status.msg} />}

            <h2>Change Password</h2>
            {label.map((item, j) => {
                return <FormControl key={j} variant="standard" sx={{ m: 1, width: '35ch' }} disabled={loading}>
                    <InputLabel htmlFor="input-with-icon-adornment" color="secondary">
                        {item}
                    </InputLabel>
                    <Input
                        color="secondary"
                        value={j === 0 ? password.oldpassword : password.newpassword}
                        id="input-with-icon-adornment"
                        type={showPassword[j] ? 'text' : 'password'}
                        onChange={(e) => {
                            setPassword((prevPassword) => {
                                const updatedPassword = { ...prevPassword };
                                if (j === 0) {
                                    updatedPassword.oldpassword = e.target.value;
                                }
                                if (j === 1) {
                                    updatedPassword.newpassword = e.target.value;
                                }
                                return updatedPassword;
                            });
                        }}
                        startAdornment={
                            <InputAdornment position="start">
                                <LockIcon />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => togglePasswordVisibility(j)}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    disabled={loading}
                                >
                                    {showPassword[j] ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

            })

            }
            <Button disabled={loading} variant="contained" color="secondary" onClick={() => {
                handleChangePassword();
            }}>Confirm</Button>
        </ModalBox>

    }

    async function handleChangeName() {
        const data = await dispatch(updateUserName(token, fullname))
        setShow(false);
        setLoading(true);
        setTimeout(() => {
            setStatus({ status: data.status, msg: data.message })
            setShow(true);
            setLoading(false);
            if (data.status === 'success') {
                setTimeout(() => {
                    setOpen('')
                    setName('')
                }, 500)
            }
        }, 2500)
    }
    async function handleChangePassword() {
        setShow(false);
        setLoading(true);
        const data = await dispatch(updateUserPassword(token, password)) //
        console.log(data)
        setTimeout(() => {
            setStatus({ status: data.status, msg: data.message })
            setShow(true);
            setLoading(false);
            if (data.status === 'success') {
                setTimeout(() => {
                    setOpen('')
                    setPassword({ oldpassword: '', newpassword: '' })
                    setTimeout(() => {
                        sessionStorage.clear();
                        navigate('/');
                    }, 200)
                }, 1000)
            }
        }, 2500)
    }

    async function handleChangeAddress() {
        const data = await dispatch(updateUserAddress(token, address))
        setShow(false);
        setLoading(true);
        setTimeout(() => {
            setStatus({ status: data.status, msg: data.message })
            setShow(true);
            setLoading(false);
            if (data.status === 'success') {
                setTimeout(() => {
                    setOpen('')
                    setAddress('')
                }, 500)
            }
        }, 2500)

    }
    async function handleChangeNumber() {
        const data = await dispatch(updateUserNumber(token, number))
        setShow(false);
        setLoading(true);
        setTimeout(() => {
            setStatus({ status: data.status, msg: data.message })
            setShow(true);
            setLoading(false);
            if (data.status === 'success') {
                setTimeout(() => {
                    setOpen('')
                    setNumber(0)
                }, 500)
            }
        }, 2500)
    }


    return (
        <>
            {open === 'cname' && changeName()}
            {open === 'cnumber' && changeNumber()}
            {open === 'caddress' && changeAddress()}
            {open === 'cpassword' && changePassword()}
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
                                    <Button color="secondary" endIcon={<EditIcon />} onClick={() => {
                                        setShow(false);
                                        setOpen('cname')
                                    }}></Button>
                                </Tooltip>
                            </div>
                            <div className={styles.items}>
                                <label><span>Email:</span> {EMAIL}</label>
                                <Button color="secondary" endIcon={<EditIcon />} disabled></Button>
                            </div>
                            <div className={styles.items}>
                                <label><span>Ph#:</span> {PHONE_NUMBER}</label>
                                <Tooltip title="Change number" placement="right">
                                    <Button color="secondary" endIcon={<EditIcon />} onClick={() => {
                                        setShow(false);
                                        setOpen('cnumber')
                                    }}></Button>
                                </Tooltip>
                            </div>
                            <div className={styles.items}>
                                <label><span>Address:</span> {ADDRESS}</label>
                                <Tooltip title='Change address' placement="right">
                                    <Button color="secondary" endIcon={<EditIcon />} onClick={() => {
                                        setShow(false);
                                        setOpen('caddress')
                                    }}></Button>
                                </Tooltip>
                            </div>
                        </div>
                        <div className={styles.sbox}>
                            <h1>Security</h1>
                            <div className={styles.items}>
                                <label><span>Password</span></label>
                                <Tooltip title='Change password' placement="right">
                                    <Button color="secondary" endIcon={<EditIcon />} onClick={() => {
                                        setShow(false);
                                        setOpen('cpassword')
                                    }}></Button>
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
