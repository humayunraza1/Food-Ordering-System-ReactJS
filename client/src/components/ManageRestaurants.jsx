import { useCallback, useEffect, useRef, useState } from "react"
import Skeleton from '@mui/material/Skeleton'
import styles from "./manageRestaurants.module.css"
import Search from "./Search"
import { Box, Button, Fab, FilledInput, FormControl, Grid, InputAdornment, InputLabel, Pagination, TextField, Tooltip, Zoom } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AlertBar from "./AlertBar";
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddIcon from '@mui/icons-material/Add';
import ModalBox from "./Modal"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
const token = sessionStorage.getItem('authToken');




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
        validNumber = true;
    } else {
        validNumber = false
    }
    console.log(nums.length)
    return validNumber;
}


function ManageRestaurants() {

    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]); // New state for filtered users
    const itemsPerPage = 6; // Number of items to display per page
    const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage); // Calculate the total number of pages
    const [currentPage, setCurrentPage] = useState(1);
    const [Status, setStatus] = useState({ status: '', msg: '' });
    const [open, setOpen] = useState(false);
    const [resAccs, setResAcc] = useState({ restaurantname: '', email: null, password: '', address: '', website: null, phonenumber: 0 })
    const [show, setShow] = useState(false);
    const [next, setNext] = useState(false);
    const [loading, setLoading] = useState(true);
    const searchText = useRef();
    const startIndex = (currentPage - 1) * itemsPerPage; // Calculate the starting index for the current page
    const visibleRestaurants = filteredRestaurants.slice(startIndex, startIndex + itemsPerPage); // Get the products to display on the current page
    const [showPassword, setShowPassword] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    async function getDetails() {
        const res = await fetch('http://192.168.18.139:3001/admin/admin-dashboard', {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            }
        });
        const data = await res.json();
        console.log(data.data.restaurants)
        setRestaurants(data.data.restaurants);
        setFilteredRestaurants(data.data.restaurants);
        setTimeout(() => {
            setLoading(false)
        }, 5000)
    }

    useEffect(() => {
        getDetails()
    }, []);

    async function searchUser() {
        const { value } = searchText.current;
        const newArr = restaurants.filter((restaurant) => {
            if (restaurant.EMAIL.includes(value) || restaurant.RESTAURANTNAME.includes(value)) {
                return restaurant
            }
        })
        setLoading(true)
        setFilteredRestaurants(newArr);
        setTimeout(() => {
            setLoading(false);
        }, 2500)

    }

    const handlePageChange = (event, value) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentPage(value);
    };

    async function addRestaurant() {
        setOpen(true);
    }


    function checkEverything() {
        let flag;
        flag = true;
        if (!isStrongPassword(resAccs.password)) {
            flag = false;
            console.log("Password not strong")
        }
        if (!isValidEmail(resAccs.email)) {
            flag = false;
            console.log("Invalid Email");
        }
        if (!isValidName(resAccs.restaurantname)) {
            flag = false;
            console.log("invalid name")
        }
        if (!isValidNumber(resAccs.phonenumber)) {
            flag = false;
            console.log("invalid phone number")
        }
        if (resAccs.website === null) {
            flag = false;
        } else {
            const pattern = /^\S+\.(com|net|org|edu|gov|mil|int|eu|info|coop|aero|museum|name|jobs|xxx|us|ca|uk|au|de|fr|jp|it|cn|in|ru|br|pk|co)$/;
            if (!pattern.test(resAccs.website)) {
                flag = false;
            }
        }
        if (resAccs.address.length === 0) {
            flag = false
        }


        if (flag) {
            setNext(true);
        } else {
            setNext(false);
        }
        // setStage(prev => prev + 1);
    }

    function isStrongPassword(password) {
        let flag = true;
        if (password.length < 6) {
            flag = false;
        }
        return flag;
    }


    const memoizedCheckEverything = useCallback(checkEverything, [
        resAccs
    ]);

    useEffect(() => {
        memoizedCheckEverything();
    }, [memoizedCheckEverything]);


    async function registerRestaurant() {
        setLoading(true);
        setShowStatus(false);
        const res = await fetch('http://192.168.18.139:3001/admin/add-restaurant', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: resAccs.email,
                address: resAccs.address,
                restaurantname: resAccs.restaurantname,
                phonenumber: resAccs.phonenumber,
                password: resAccs.password,
                website: resAccs.website
            })
        })
        const data = await res.json();
        if (!data || data.status === 'error') {
            setStatus({ status: 'error', msg: data.message })
        }
        if (data.status === 'success') {
            setStatus({ status: 'success', msg: data.message })
        }
        setTimeout(() => {
            setLoading(false);
            setShowStatus(true);
            setTimeout(() => {
                getDetails();
                setOpen(false);
            }, 800)
        }, 2000)
        console.log("data from registration: ", data);
    }

    async function deleteRestaurant(resid) {
        setShowStatus(false);
        const res = await fetch(`http://localhost:3001/admin/restaurants?restaurantid=${resid}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json();
        if (!data || data.status === 'error') {
            setStatus({ status: 'error', msg: data.message })
        }
        if (data.status === 'success') {
            setLoading(true);
            setStatus({ status: 'success', msg: data.message })
        }
        setTimeout(() => {
            setLoading(false);
            setShowStatus(true);
            getDetails()
            setTimeout(() => {
                setShowStatus(false);
            }, 1000)
        }, 2000)
        console.log(data);
    }
    return (
        <>
            {open && <ModalBox open={open} setOpen={setOpen}>
                {showStatus && <AlertBar status={Status.status} msg={Status.msg} />}
                <h2>Add Restaurant</h2>
                <TextField disabled={loading} color="secondary" id="filled-basic" label="Restaurant Name" variant="filled" value={resAccs.restaurantname} onChange={(e) => setResAcc({ ...resAccs, restaurantname: e.target.value })} />
                <TextField disabled={loading} color="secondary" id="filled-basic" label="Email" value={resAccs.email} onChange={(e) => setResAcc({ ...resAccs, email: e.target.value })} variant="filled" />
                <FormControl disabled={loading} variant="filled" color="secondary">
                    <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                    <FilledInput
                        id="filled-adornment-password"
                        value={resAccs.password}
                        onChange={(e) => setResAcc({ ...resAccs, password: e.target.value })}
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
                <TextField disabled={loading} color="secondary" id="filled-basic" label="Phone Number" type="number" value={resAccs.phonenumber} onChange={(e) => setResAcc({ ...resAccs, phonenumber: e.target.value })} variant="filled" />
                <TextField disabled={loading} id="filled-basic" label="Address" value={resAccs.address} onChange={(e) => setResAcc({ ...resAccs, address: e.target.value })} color="secondary" variant="filled" />
                <TextField disabled={loading} id="filled-basic" label="Website" color="secondary" value={resAccs.website} onChange={(e) => setResAcc({ ...resAccs, website: e.target.value })} variant="filled" />
                {next && <Button disabled={loading} color="secondary" variant="contained" onClick={registerRestaurant}>Register Restaurant</Button>}
            </ModalBox>}
            <div className={styles.userContainer}>
                <Tooltip disableFocusListener placement="top" aria-label="Add Restaurant" title="Add Restaurant" >
                    <Fab onClick={addRestaurant} color="secondary" sx={{ position: 'fixed', bottom: '40px', right: '40px' }}><StorefrontIcon /><AddIcon /></Fab>
                </Tooltip>
                {showStatus && <AlertBar status={Status.status} msg={Status.msg} />}
                <div className={styles.searchContainer}>
                    <Search searchText={searchText} onSearch={searchUser} startIcon={<SearchIcon />} placeholder="Search restaurant's name" />
                </div>
                <div className={styles.usersList}>
                    {filteredRestaurants.length === 0 ? <div className={styles.noRes}><p>No restaurants to show</p></div> :
                        (visibleRestaurants.map((restaurant, h) => {
                            return <>
                                {loading ? <Skeleton key={h} animation="wave" variant="rounded" sx={{ width: { md: 510, sm: 410, xs: 350 } }} height={100} /> :
                                    <Zoom in={true}>
                                        <Box key={h} sx={{ width: { md: 510, sm: 410, xs: 350 }, height: 100 }} className={styles.userBox}>
                                            <Grid container sx={{ height: '100%' }}>
                                                <Grid xs={2} height='100%' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', lineHeight: '35px' }}>

                                                    <p style={{ fontSize: '3.1rem', opacity: '0.5', color: 'grey' }}>{restaurant.RESTAURANTID}</p>
                                                    <p style={{ fontSize: '0.8rem', opacity: '0.5', color: 'grey' }}>RES ID</p>
                                                </Grid>
                                                <Grid xs={8} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', rowGap: '10px', fontSize: '0.9rem', lineHeight: '20px' }}>
                                                    <p>Restaurant: {restaurant.RESTAURANTNAME}</p>
                                                    <p>Email: {restaurant.EMAIL}</p>
                                                    <p>Ph#: {restaurant.PHONE_NUMBER}</p>
                                                </Grid>
                                                <Grid xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                    <IconButton color="error" aria-label="delete" onClick={() => deleteRestaurant(restaurant.RESTAURANTID)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Zoom>
                                }
                            </>
                        }))}
                    <Pagination page={currentPage} count={totalPages} onChange={handlePageChange} color="secondary" />
                </div>
            </div>
        </>
    )
}

export default ManageRestaurants
