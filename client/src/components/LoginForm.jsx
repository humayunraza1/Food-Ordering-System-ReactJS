import styles from "./loginform.module.css";
import LogoComp from "./LogoComp"
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import LockIcon from '@mui/icons-material/Lock';
import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Fab } from "@mui/material";
import { styled } from '@mui/system';
import { purple, grey } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";
import AlertBar from "./AlertBar";
import { useDispatch } from 'react-redux';
import { fetchUserDetails } from "../actions/fetchUserActions.js"

const btnStyle = {
    color: 'common.white',
    marginTop: '20px',
    zIndex: 0,
    bgcolor: purple[500],
    '&:hover': {
        bgcolor: purple[600],
    },
};

const MyFab = styled(Fab)(({ theme }) => ({

    '.fabIcon': {
        display: 'block',
        transition: '2s'
    },
    '.fabIconHover': {
        display: 'none',
        transition: '2s'
    },
    '&:hover': {
        '.fabIcon': {
            display: 'none',
            transition: '2s'
        },
        '.fabIconHover': {
            display: 'block',
            transition: '2s'
        },
    },
}));

function LoginForm({ apiURL, Type }) {
    const [showPassword, setShowPassword] = useState(false);
    const [login, setLogin] = useState({ Email: "", Password: "" });
    const [isLoading, setLoading] = useState(false);
    const [Show, setShow] = useState(false);
    const dispatch = useDispatch();
    const [status, setStatus] = useState({ Status: '', msg: '' })
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const navigate = useNavigate();
    async function handleLogin(e) {
        e.preventDefault();
        setShow(false);
        const email = login.Email;
        const password = login.Password;
        setLoading(true);
        const res = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        const data = await res.json();
        console.log(data);
        if (!data) {
            setLoading(false);
            setShow(true);
            setStatus({ Status: 'error', msg: 'Error Occurred!' })
        }

        if (data.status === 'failed') {
            setTimeout(function () {
                setLoading(false);
                setShow(true);
                setStatus({ Status: 'error', msg: 'Incorrect login credentials!' })
            }, 2000)
        }

        if (data.status === 'success') {
            setTimeout(function () {
                setLoading(false);
                setShow(true);
                setStatus({ Status: 'success', msg: 'Successfuly logged in' })
                if (Type === 'User') {
                    sessionStorage.setItem('authToken', data.token)
                    dispatch(fetchUserDetails(data.token))
                    navigate('/')
                    setTimeout(function () {
                        window.location.reload();
                    }, 500);
                }
                if (Type === 'Restaurant') {
                    sessionStorage.setItem('restToken', data.token)
                    setTimeout(() => {
                        window.location.reload();
                    }, 300)
                }

            }, 2000)
        }
        console.log(data);
        // sessionStorage.setItem('authToken', data.token);
        // setLoggedIn(true)
        // setTimeout(function () {
        //     navigate('/')
        // }, 2000)

    }

    return (
        <>
            {Show && <AlertBar status={status.Status} msg={status.msg} />}
            <LogoComp>
                <div className={styles.formContainer}>
                    <form method="post" className={styles.formC}>
                        <FormControl variant="standard" sx={{ m: 1, width: '35ch' }} disabled={isLoading}>
                            <InputLabel htmlFor="input-with-icon-adornment" color="secondary">
                                Email
                            </InputLabel>
                            <Input
                                color="secondary"
                                id="input-with-icon-adornment"
                                value={login.Email}
                                onChange={(e) => setLogin({ ...login, Email: e.target.value })}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '35ch' }} disabled={isLoading}>
                            <InputLabel htmlFor="input-with-icon-adornment" color="secondary">
                                Password
                            </InputLabel>
                            <Input
                                color="secondary"
                                value={login.Password}
                                onChange={(e) => setLogin({ ...login, Password: e.target.value })}
                                id="input-with-icon-adornment"
                                type={showPassword ? 'text' : 'password'}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <MyFab sx={btnStyle} type="submit" onClick={handleLogin} disabled={isLoading}>
                            <LockIcon sx={{ color: grey[50] }} className="fabIcon" />
                            <LockOpenIcon sx={{ color: grey[50] }} className="fabIconHover" />
                        </MyFab>
                    </form>
                </div>
            </LogoComp>
        </>
    )


}


export default LoginForm
