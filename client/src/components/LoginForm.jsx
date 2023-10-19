import styles from "./loginform.module.css"
import TextField from '@mui/material/TextField';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import EmailIcon from '@mui/icons-material/Email';
function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginContents}>
                <div className={styles.heading}>
                    <h1>
                        Foody Mart
                    </h1>
                    <div>
                        Eat That Foody.
                    </div>
                </div>

                <div className={styles.formContainer}>
                    <TextField sx={{ m: 1, width: '45ch' }} color="secondary" label="Name" variant="filled" />
                    <TextField sx={{ m: 1, width: '45ch' }} color="secondary" label="Email" variant="filled" InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>
                        ),
                    }} />

                    <FormControl sx={{ m: 1, width: '45ch' }} color="secondary" variant="filled">
                        <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                        <FilledInput
                            id="filled-adornment-password"
                            type={showPassword ? 'text' : 'password'}

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
                </div>
            </div>
        </div>
    )
}

export default LoginForm
