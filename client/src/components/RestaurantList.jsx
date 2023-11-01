import { Box, Button, Divider, Grid, IconButton, Rating, Skeleton, Zoom } from "@mui/material"
import styles from "./restaurantList.module.css"
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ModalBox from "./Modal"
import AddIcon from '@mui/icons-material/Add';

function RestaurantList({ loading, restaurants, setFilteredRestaurants, filteredRestaurants }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [seletedRestaurant, setSelectedRestaurant] = useState([]);
    const [details, setDetails] = useState({ restaurantName: '', restaurantWebsite: '' });
    const [forceLogin, setForceLogin] = useState(false);


    async function openRestaurant(resID, resName) {
        setOpen(true);
        const res = await fetch(`http://192.168.18.139:3001/users/browseProducts?restaurantid=${resID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json();
        const find = await filteredRestaurants.find((res) => {
            if (res.RESTAURANTID === parseInt(resID)) {
                return res
            }
        })
        setSelectedRestaurant(data.data);
        setDetails({ restaurantName: find.RESTAURANTNAME, restaurantWebsite: find.WEBSITE });
    }

    function addToCart(item) {
        const token = sessionStorage.getItem('authToken')
        if (!token) {
            setForceLogin(true);
        } else {
            console.log(`${item.NAME} added to cart`)
        }
    }

    return (
        <>
            {forceLogin && <ModalBox open={forceLogin} setOpen={setForceLogin}>
                <h2>Please login first</h2>
                <Button variant="contained" color="secondary" onClick={() => navigate('/login')}>Login</Button>
            </ModalBox>}
            {open && <ModalBox open={open} setOpen={setOpen}>
                <Grid container>
                    <Grid sm={12}>
                        <img alt="restaurant" style={{ width: '100%', height: '100%', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }} src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"></img>
                    </Grid>
                    <Grid sm={12}>
                        <h1>{details.restaurantName}</h1>
                        <p>{details.restaurantWebsite}</p>
                    </Grid>
                    <Divider width={'100%'} sx={{ backgroundColor: 'black', marginBottom: '10px' }} />
                    <h2>ITEMS</h2>
                    <Grid container rowGap={'10px'}>
                        {seletedRestaurant.map((item, h) => {
                            return <Box width={'100%'} height={'50px'} sx={{ backgroundColor: 'aliceblue', borderRadius: '10px', marginTop: '10px' }}>
                                <Grid container>
                                    <Grid sm={9} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div className={styles.item}>
                                            <p>
                                                {item.NAME}
                                            </p>
                                            <p>{item.DESCRIPTION}</p>
                                        </div>
                                    </Grid>
                                    <Grid sm={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <p>Rs{item.PRICE}</p>
                                    </Grid>
                                    <Grid sm={1}>
                                        <IconButton color="secondary" onClick={() => addToCart(item)}>
                                            <AddIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        })}
                    </Grid>
                </Grid>

            </ModalBox>
            }
            <div className={styles.listContainer}>
                <Grid container sx={{ width: '90%' }} xs={12}>
                    {filteredRestaurants.length === 0 ? <p>No Restaurants To Show</p> :
                        (filteredRestaurants.map((restaurant, h) => {
                            var randomValue = Math.floor(2 + Math.random() * 4); // Generates a random integer between 2 and 5 (inclusive of both 2 and 5)
                            return <Grid container xs={12} sm={6} md={4} lg={3} key={h} sx={{ margin: '50px' }}>
                                {loading ? <Skeleton key={h} animation='wave' variant='rounded' height={'250px'} /> :
                                    <Zoom in={true}>
                                        <div onClick={() => openRestaurant(restaurant.RESTAURANTID)}>
                                            <Box className={styles.resBox} sx={{ height: '250px', width: '300px', borderRadius: '10px', boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                                                <Grid container>
                                                    <Grid xs={12} sx={{ height: '150px', display: 'flex', alignItems: 'center', borderBottomStyle: 'solid', borderWidth: '1px' }}>
                                                        <img alt="restaurant" style={{ width: '100%', height: '100%', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }} src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"></img>
                                                    </Grid>
                                                    <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <div className={styles.restHeading}>
                                                            <h1>
                                                                {restaurant.RESTAURANTNAME}
                                                            </h1>
                                                            <div className={styles.rating}>
                                                                <Rating name="read-only" value={randomValue} readOnly /><span style={{ color: 'grey', opacity: '0.5' }}>  {randomValue}/5</span>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </div>
                                    </Zoom>
                                }
                            </Grid>
                        }))}

                </Grid>
            </div>
        </>
    )
}


export default RestaurantList
