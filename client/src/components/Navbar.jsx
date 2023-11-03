import styles from "./navbar.module.css"
import Button from '@mui/material/Button';
import Zoom from '@mui/material/Zoom';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { createContext, useContext, useState } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Divider, Drawer } from "@mui/material";
import { CartContext } from "../pages/Home";

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
function Navbar({ isTitleVisible }) {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [openCart, setOpenCart] = useState(false);
    const user = useSelector((state) => state.fetchUser.user);
    const navigate = useNavigate();
    const { cartItem, setCartItem } = useContext(CartContext);

    // let token = '';
    // if (sessionStorage.length === 1) {
    //     token = sessionStorage.getItem('authToken');
    // } else {
    //     sessionStorage.clear();
    // }
    // useEffect(() => {
    //     try {
    //         async function fetchData() {
    //             console.log(token)
    //             const res = await fetch('http://192.168.18.139:3001/users/user-details', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Authorization': `${token}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             });

    //             const data = await res.json();
    //             if (!data || data.status !== 'success') {
    //                 console.log(data);
    //             } else {
    //                 setName(data.data.FULLNAME.toUpperCase());
    //             }
    //         }
    //         fetchData();
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }, [token])

    function toggleDrawer(event) {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpenCart(false);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <nav className={styles.nav}>
            <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid xs={11} className={styles.navbox2}>
                    {isTitleVisible && <Zoom in={isTitleVisible}>
                        <h1>
                            Foody Mart
                        </h1>
                    </Zoom>
                    }
                </Grid>
                <Drawer anchor="right" open={openCart} onClose={toggleDrawer}>
                    <Box className={styles.cartBox} width={'300px'} height={'100dvh'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '10px' }}>
                        {<>
                            <h2>Cart({cartItem.length})</h2>
                            <Divider width={'100%'} />
                        </>
                        }
                        {cartItem.length === 0 ? <p>Cart is Empty</p> :
                            cartItem.map((item, i) => {
                                return <Grid container width={'270px'} sx={{ backgroundColor: 'aliceblue' }} rowGap={1} padding={1} borderRadius={'10px'} fontSize={'0.95rem'}>
                                    <Grid xs={2}>
                                        <p>Qty</p>
                                    </Grid>
                                    <Grid xs={8} sx={{ display: 'flex', justifyContent: 'center', }}>
                                        <p>Name</p>
                                    </Grid>
                                    <Grid xs={2}>
                                        <p>Price</p>
                                    </Grid>
                                    <Grid xs={2}>
                                        <p>{item.Qty}</p>
                                    </Grid>
                                    <Grid xs={8} sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                                        <p>{item.name}</p>
                                    </Grid>
                                    <Grid xs={2}>
                                        <p>{item.price}</p>
                                    </Grid>
                                </Grid>
                            })}
                        {console.log("navbar cart: ", cartItem)}
                    </Box>
                </Drawer>
                <Grid xs={1} columnGap={2} className={styles.navbox3}>
                    {sessionStorage.getItem('authToken') === null &&
                        <>
                            <Button className={styles.btn} variant="outlined" sx={btnStyle2} onClick={() => navigate('/register')}>Signup</Button>
                            <Button className={styles.btn} variant="contained" onClick={() => navigate('/login')} sx={btnStyle}>Login</Button>
                        </>
                    }
                    {sessionStorage.getItem('authToken') !== null && <>
                        <IconButton sx={{ color: grey[50] }} onClick={() => setOpenCart(true)}>
                            <ShoppingCartIcon sx={{ color: grey[50] }} />
                        </IconButton>
                    </>}
                    {/* {sessionStorage.length === 1 && <Button className={styles.btn} variant="contained" onClick={() => {
                    sessionStorage.clear()
                    window.location.reload()
                }} sx={btnStyle}>Logout</Button>} */}
                    {sessionStorage.getItem('authToken') !== null && <>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={user.FULLNAME.toUpperCase()} src="/static/images/avatar/2.jpg" />
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
                                    <Typography textAlign="center" onClick={() => navigate('users/dashboard')}>Account</Typography>
                                </MenuItem>
                                <MenuItem key='Logout' onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center" onClick={() => {
                                        sessionStorage.removeItem('authToken');
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 200)
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
        </nav >

    )
}

export default Navbar
