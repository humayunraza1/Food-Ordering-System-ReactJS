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
import PhoneIcon from '@mui/icons-material/Phone';
import ColorStepper from "./ColorStepper";
import { purple } from '@mui/material/colors';
import { Fab } from "@mui/material";

const btnStyle = {
    color: 'common.white',
    marginTop: '20px',
    zIndex: 0,
    bgcolor: purple[500],
    '&:hover': {
        bgcolor: purple[600],
    },
};


function LoginForm() {
    const [formStage, setStage] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleInput = (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    };

    function handleNext() {
        setStage(prev => prev + 1);
    }
    function handleBefore() {
        setStage(prev => prev - 1);
    }
    return (
        <>
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
                    <ColorStepper stage={formStage} />

                    <div className={styles.formContainer}>
                        <form method="post" className={styles.formC}>
                            {formStage == 0 &&
                                <>
                                    <TextField sx={{ m: 1, width: '45ch' }} color="secondary" label="First Name" variant="filled" />
                                    <TextField sx={{ m: 1, width: '45ch' }} color="secondary" label="Last Name" variant="filled" />
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
                                            autoComplete="new-password"
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
                                    <TextField
                                        label="Phone Number"
                                        variant="filled"
                                        type="tel"
                                        color="secondary"
                                        sx={{ m: 1, width: '45ch' }}
                                        onInput={handleInput}
                                        InputProps={{

                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                </>
                            }
                            {formStage == 1 &&
                                <>
                                    <form method="post" className={styles.formC}>
                                        <TextField
                                            id="filled-multiline-static"
                                            label="Address"
                                            multiline
                                            color="secondary"
                                            rows={4}
                                            variant="filled"
                                        />
                                    </form>
                                </>
                            }
                            <div className={formStage > 0 ? styles.btndiv2 : styles.btndiv}>
                                {formStage > 0 &&

                                    <Fab variant="contained" onClick={handleBefore} sx={btnStyle}><span style={{ fontSize: '30px' }}>&larr;</span></Fab>
                                }

                                <Fab variant="contained" onClick={handleNext} sx={btnStyle}><span style={{ fontSize: '30px' }}>&rarr;</span></Fab>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginForm
