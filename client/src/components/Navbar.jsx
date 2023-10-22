import styles from "./navbar.module.css"
import Button from '@mui/material/Button';
import Zoom from '@mui/material/Zoom';
import { useNavigate } from "react-router";
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import Grid from '@mui/material/Unstable_Grid2';

const btnStyle = {
    color: 'common.black',
    bgcolor: "white",
    '&:hover': {
        bgcolor: "#F0F0F0",
        boxShadow: 0,
    },
    boxShadow: 0,
};

const btnStyle2 = {
    color: "common.white",
    bgcolor: "transparent",
    borderColor: grey[50],
    '&:hover': {
        bgcolor: grey[50],
        color: "common.black",
    },
    boxShadow: 0,
};
function Navbar({ isTitleVisible, isLoggedIn, setLoggedIn }) {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    let token = '';
    if (sessionStorage.length === 1) {
        token = sessionStorage.getItem('authToken');
    }
    useEffect(() => {
        try {
            async function fetchData() {
                console.log(token)
                const res = await fetch('http://192.168.18.139:3001/users/user-details', {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                if (!data || data.status !== 'success') {
                    console.log(data);
                } else {
                    setName(data.data.FULLNAME.toUpperCase())
                }
            }
            fetchData();
        } catch (err) {
            console.log(err)
        }
    })


    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <nav className={styles.nav}>
            <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid xs={12} md={4}></Grid>
                <Grid xs={8} md={4} className={styles.navbox2}>
                    {isTitleVisible && <Zoom in={isTitleVisible}>
                        <h1>
                            Foody Mart
                        </h1>
                    </Zoom>
                    }
                </Grid>
                <Grid xs={4} md={4} className={styles.navbox3}>
                    {sessionStorage.length === 0 &&
                        <>
                            <Button className={styles.btn} variant="outlined" sx={btnStyle2} onClick={() => navigate('/register')}>Signup</Button>
                            <Button className={styles.btn} variant="contained" onClick={() => navigate('/login')} sx={btnStyle}>Login</Button>
                        </>
                    }
                    {/* {sessionStorage.length === 1 && <Button className={styles.btn} variant="contained" onClick={() => {
                    sessionStorage.clear()
                    window.location.reload()
                }} sx={btnStyle}>Logout</Button>} */}
                    {sessionStorage.length === 1 && <>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={name} src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >

                                <MenuItem key='Account' onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">Account</Typography>
                                </MenuItem>
                                <MenuItem key='Logout' onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center" onClick={() => {
                                        sessionStorage.clear();
                                        window.location.reload();
                                    }}>Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </>}
                </Grid>
            </Grid>
            {/* <div className={styles.navbox2}>
                {isTitleVisible && <Zoom in={isTitleVisible}>
                    <h1>
                        Foody Mart
                    </h1>
                </Zoom>
                }
            </div> */}
            {/* <div className={styles.navbox3}> */}
            {/* {sessionStorage.length === 0 &&
                    <>
                        <Button className={styles.btn} variant="outlined" sx={btnStyle2} onClick={() => navigate('/register')}>Signup</Button>
                        <Button className={styles.btn} variant="contained" onClick={() => navigate('/login')} sx={btnStyle}>Login</Button>
                    </>
                } */}
            {/* {sessionStorage.length === 1 && <Button className={styles.btn} variant="contained" onClick={() => {
                    sessionStorage.clear()
                    window.location.reload()
                }} sx={btnStyle}>Logout</Button>} */}
            {/* {sessionStorage.length === 1 && <>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={name} src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >

                            <MenuItem key='Account' onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">Account</Typography>
                            </MenuItem>
                            <MenuItem key='Logout' onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" onClick={() => {
                                    sessionStorage.clear();
                                    window.location.reload();
                                }}>Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </>} */}
            {/* </div> */}
        </nav>

    )
}

export default Navbar
