import { Fab, Zoom } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import TextField from '@mui/material/TextField';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import { purple } from '@mui/material/colors';
import { useEffect, useState, useCallback } from "react";
import styles from "./registerItems.module.css";

const btnStyle = {
    color: 'common.white',
    marginTop: '20px',
    zIndex: 0,
    bgcolor: purple[500],
    '&:hover': {
        bgcolor: purple[600],
    },
};


let emailIsValid = false;
function isValidEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (emailRegex.test(email)) {
        emailIsValid = true;
    } else {
        emailIsValid = false;
    }
    return emailIsValid;
}

let validName = false;

function isValidName(name) {
    const nameRegex = /^[A-Za-z\s]+$/g;
    if (nameRegex.test(name)) {
        validName = true
    } else {
        validName = false;
    }
    return validName;
}

let validNumber = false;
function isValidNumber(number) {
    let nums = number.toString();
    if (nums.length === 11) {
        console.log("valid number: ", nums.length)
        validNumber = true;
    } else {
        validNumber = false
    }
    console.log(nums.length)
    return validNumber;
}

function RegisterItems({ formStage, setStage }) {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [accDetails, setDetails] = useState({ Name: "", Email: "", Password: "", Number: 0, Address: "" });
    // const [passStrength, setStrength] = useState({ oneNumber: false, eightChar: false, specialChar: false })
    const [Status, setStatus] = useState({ Error: false, msg: "" });
    const [showNext, setNext] = useState(false);
    const [isEigColor, setEIGColor] = useState("red");
    const [oneSPColor, setSPColor] = useState("red");
    const [oneNumColor, setNumColor] = useState("red");
    const [isPasswordFocused, setPasswordFocused] = useState(false);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleInput = (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    };


    function checkEverything() {
        let flag;
        if (formStage === 0) {
            flag = true;
            if (!isStrongPassword(accDetails.Password)) {
                flag = false;
                console.log("Password not strong")
            }
            if (!isValidEmail(accDetails.Email)) {
                flag = false;
                console.log("Invalid Email");
            }
            if (!isValidName(accDetails.Name)) {
                flag = false;
                console.log("invalid name")
            }
            if (!isValidNumber(accDetails.Number)) {
                flag = false;
                console.log("invalid phone number")
            }
        }

        if (formStage === 1) {
            flag = true;
            if (accDetails.Address.length === 0) {
                flag = false
            }
        }

        if (flag) {
            setNext(true);
            console.log(accDetails)
        } else {
            setNext(false);
        }
        // setStage(prev => prev + 1);
    }

    function handleNext(e) {
        e.preventDefault();
        setStage(1);
    }

    function handleBefore() {
        setStage(prev => prev - 1);
    }


    let isEightChar = false;

    function checkEightChar(password) {
        const eightChar = /.{8,}/;
        if (eightChar.test(password)) {
            isEightChar = true;
            setEIGColor("green")
            console.log("has at least eight char:", isEightChar)
            return isEightChar;
        } else {
            isEightChar = false;
            setEIGColor("red")
            return isEightChar;
        }
    }

    let hasOneNumber = false;

    function checkOneNumber(password) {
        const oneNumber = /\d/;
        if (oneNumber.test(password)) {
            hasOneNumber = true;
            setNumColor("green");
            console.log("has one number:", hasOneNumber)
            // setStrength({ ...passStrength, oneNumber: true })
            return hasOneNumber;
        } else {
            hasOneNumber = false;
            setNumColor("red");
            return hasOneNumber;
        }
    }

    let hasOneSpecial = false;
    function oneSpecialChar(password) {
        const oneSpecialChar = /[@#$%^&+=!]/g;
        if (oneSpecialChar.test(password)) {
            hasOneSpecial = true;
            setSPColor("green")
            console.log("has one special:", hasOneSpecial);
            return hasOneSpecial;
        } else {
            hasOneSpecial = false;
            setSPColor("red")
            return hasOneSpecial;
        }
    }

    function isStrongPassword(password) {
        let flag = true;
        if (!checkEightChar(password)) {
            flag = false
            console.log("pass not eight char")
        }
        if (!checkOneNumber(password)) {
            flag = false;
            console.log("pass doesnt contain a number")
        }
        if (!oneSpecialChar(password)) {
            flag = false;
            console.log("pass doesnt contain special char")
        }
        const pst = {
            "Eight Char": isEightChar,
            "One Number": hasOneNumber,
            "One Special": hasOneSpecial
        }
        console.log(pst);
        return flag;
    }
    async function completeForm(e) {
        e.preventDefault();
        const fullName = accDetails.Name;
        const email = accDetails.Email;
        const password = accDetails.Password;
        const phoneNumber = accDetails.Number;
        const address = accDetails.Address;

        const res = await fetch("http://localhost:3001/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fullName,
                email,
                password,
                phoneNumber,
                address
            })
        });

        const data = await res.json();
        console.log(data);
    }
    const handleFocusPassword = () => {
        setPasswordFocused(true);
    };

    const handleBlurPassword = (e) => {
        if (isStrongPassword(e.target.value)) {
            setPasswordFocused(false);
        }
    };
    const memoizedCheckEverything = useCallback(checkEverything, [
        accDetails,
        formStage
    ]);

    useEffect(() => {
        memoizedCheckEverything();
    }, [memoizedCheckEverything]);
    return (
        <>
            {formStage === 0 &&
                <>
                    <TextField value={accDetails.Name} sx={{ m: 1, width: '45ch' }} color="secondary" label="Full    Name" variant="filled" onChange={(e) => {
                        const { value } = e.target;
                        if (isValidName(value)) {
                            setDetails({ ...accDetails, Name: value })
                        } else {
                            setDetails({ ...accDetails, Name: "" })
                        }
                    }} />
                    <TextField value={accDetails.Email} sx={{ m: 1, width: '45ch' }} color="secondary" label="Email" variant="filled" onChange={(e) => {
                        const { value } = e.target;
                        if (isValidEmail(value)) {
                            setDetails({ ...accDetails, Email: value })
                            console.log("valid email address")
                        } else {
                            setDetails({ ...accDetails, Email: value })
                            console.log("invalid email address")
                        }
                    }} InputProps={{
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
                            value={accDetails.Password}
                            onFocus={handleFocusPassword}
                            onBlur={(e) => handleBlurPassword(e)}
                            onChange={(e) => {
                                const { value } = e.target;
                                if (isStrongPassword(value)) {
                                    setDetails({ ...accDetails, Password: value })
                                } else {
                                    setDetails({ ...accDetails, Password: value })
                                }
                            }}
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
                    {<div className={isPasswordFocused ? `${styles.visible}` : `${styles.passStrength}`}>
                        <p style={{ color: isEigColor }}> {isEigColor === "red" ? "✖" : "✔"} is at least 8 characters long </p>
                        <p style={{ color: oneSPColor }}> {oneSPColor === "red" ? "✖" : "✔"} has at least 1 special character </p>
                        <p style={{ color: oneNumColor }}>{oneNumColor === "red" ? "✖" : "✔"} has at least 1 number </p>
                    </div>}
                    <TextField
                        label="Phone Number"
                        variant="filled"
                        value={accDetails.Number}
                        onChange={(e) => {
                            const { value } = e.target;
                            setDetails({ ...accDetails, Number: value });
                        }}
                        type="tel"
                        onInput={handleInput}
                        color="secondary"
                        sx={{ m: 1, width: '45ch' }}
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
            {formStage === 1 &&
                <>
                    <TextField
                        id="filled-multiline-static"
                        label="Address"
                        onChange={(e) => setDetails({ ...accDetails, Address: e.target.value })}
                        multiline
                        value={accDetails.Address}
                        color="secondary"
                        rows={4}
                        variant="filled"
                    />
                </>
            }
            <div className={formStage > 0 ? styles.btndiv2 : styles.btndiv}>
                {formStage === 1 &&

                    <Fab variant="contained" onClick={handleBefore} sx={btnStyle}><ArrowBackIcon /></Fab>
                }
                {showNext && <Zoom in={showNext}>
                    <Fab variant="contained" type="submit" onClick={formStage < 1 ? handleNext : completeForm} sx={btnStyle}>{formStage < 1 ? <ArrowForwardIcon /> : <DoneIcon />}</Fab>
                </Zoom>
                }
            </div>
        </>
    )
}

export default RegisterItems