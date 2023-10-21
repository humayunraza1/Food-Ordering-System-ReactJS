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

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    return (
        <>
            <LogoComp>
                <div className={styles.formContainer}>
                    <form method="post" className={styles.formC}>
                        <FormControl variant="standard" sx={{ m: 1, width: '35ch' }}>
                            <InputLabel htmlFor="input-with-icon-adornment" color="secondary">
                                Email
                            </InputLabel>
                            <Input
                                color="secondary"
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '35ch' }}>
                            <InputLabel htmlFor="input-with-icon-adornment" color="secondary">
                                Password
                            </InputLabel>
                            <Input
                                color="secondary"
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
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <MyFab sx={btnStyle} type="submit">
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
