import { Box, Button, Divider, Grid, IconButton, Rating, Skeleton, Zoom } from "@mui/material"
import styles from "./restaurantList.module.css"
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ModalBox from "./Modal"
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { CartContext } from "../pages/Home";
import AlertBar from "./AlertBar"
function RestaurantList({ loading, restaurants, setFilteredRestaurants, filteredRestaurants }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [seletedRestaurant, setSelectedRestaurant] = useState([]);
    const [details, setDetails] = useState({ restaurantName: '', restaurantWebsite: '' });
    const { cartItem, setCartItems } = useContext(CartContext);
    const [forceLogin, setForceLogin] = useState(false);
    const [status, setStatus] = useState({ status: '', msg: '' });
    const [openn, setOpenn] = useState(false);

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
            console.log(item)
            let cart = { productId: item.PRODUCTID, resid: item.RESTAURANTID, name: item.NAME, quantity: 1, price: item.PRICE }
            if (cartItem.length === 0) {
                setCartItems((prev) => { return [...prev, cart] });
                setStatus({ status: 'success', msg: `${item.NAME} added to cart` })
                setOpenn(true);
                setTimeout(() => {
                    setOpenn(false);
                }, 1000)
            } else {
                const existingIndex = cartItem.findIndex((i) => { return i.productId === item.PRODUCTID && i.resid === item.RESTAURANTID })
                // console.log("existing index: ", existingIndex);
                const product = cartItem[existingIndex];
                // console.log("product: ", product)
                if (existingIndex >= 0) {
                    const newProd = {
                        productId: product.productId,
                        resid: product.resid,
                        name: product.name,
                        quantity: product.quantity + 1,
                        price: product.price + item.PRICE,
                    }
                    console.log("new product: ", newProd)
                    const newArr = cartItem.map((i, index) => {
                        return index === existingIndex ? newProd : i;
                    });
                    console.log("newArr: ", newArr)
                    setCartItems(newArr);
                    setStatus({ status: 'success', msg: `${newProd.quantity}x ${item.NAME} added to cart` })
                    setOpenn(true);
                    setTimeout(() => {
                        setOpenn(false)
                    }, 1000);

                } else {
                    const isSameRest = cartItem.findIndex((i) => { return i.resid === item.RESTAURANTID })
                    if (isSameRest >= 0) {
                        setCartItems((prev) => [...prev, cart])
                        setStatus({ status: 'success', msg: `${item.NAME} added to cart` })
                        setOpenn(true);
                        setTimeout(() => {
                            setOpenn(false);
                        }, 1000)
                    } else {
                        setStatus({ status: 'error', msg: `ERROR! Item not of the same restaurant as previous items.` })
                        setOpenn(true);
                        setTimeout(() => {
                            setOpenn(false);
                        }, 2000)
                    }
                }
            }
        }
        console.log("Cart Items: ", cartItem)
    }
    return (
        <>
            <CartContext.Provider value={{ cartItem, setCartItems }}>
                {forceLogin && <ModalBox open={forceLogin} setOpen={setForceLogin}>
                    <h2>Please login first</h2>
                    <Button variant="contained" color="secondary" onClick={() => navigate('/login')}>Login</Button>
                    <Button color="secondary" onClick={() => navigate('/register')}>Register</Button>
                </ModalBox>}
                {open && <ModalBox open={open} setOpen={setOpen}>
                    <Grid container rowGap={2}>
                        {openn &&
                            <Grid xs={12}>
                                <AlertBar status={status.status} msg={status.msg} />
                            </Grid>
                        }
                        <Grid xs={12}>
                            <IconButton onClick={() => setOpen(false)} color="secondary">
                                <ArrowBackIosIcon color="secondary" />
                            </IconButton>
                        </Grid>
                        <Grid xs={12}>
                            <img alt="restaurant" style={{ width: '100%', height: '100%', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }} src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"></img>
                        </Grid>
                        <Grid xs={12}>
                            <h1>{details.restaurantName}</h1>
                            <p>{details.restaurantWebsite}</p>
                        </Grid>
                        <Divider width={'100%'} sx={{ backgroundColor: 'black', marginBottom: '10px' }} />
                        <h2>ITEMS</h2>
                        <Grid container rowGap={'10px'}>
                            {seletedRestaurant.map((item, h) => {
                                return <Box width={'100%'} height={'50px'} sx={{ backgroundColor: 'aliceblue', borderRadius: '10px' }}>
                                    <Grid container>
                                        <Grid xs={9} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <div className={styles.item}>
                                                <p>
                                                    {item.NAME}
                                                </p>
                                                <p>{item.DESCRIPTION}</p>
                                            </div>
                                        </Grid>
                                        <Grid xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <p>Rs{item.PRICE}</p>
                                        </Grid>
                                        <Grid xs={1}>
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
                    <Grid container sx={{ width: '90%' }} marginTop={'50px'} rowGap={5}>
                        {filteredRestaurants.length === 0 ? <p>No Restaurants To Show</p> :
                            (filteredRestaurants.map((restaurant, h) => {
                                var randomValue = Math.floor(2 + Math.random() * 4); // Generates a random integer between 2 and 5 (inclusive of both 2 and 5)
                                return <Grid container xs={12} sm={6} md={4} lg={3} key={h} justifyContent={'center'}>
                                    {loading ? <Skeleton key={h} animation='wave' variant='rounded' sx={{ width: { xs: 350 } }} height={'250px'} /> :
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
            </CartContext.Provider>
        </>
    )
}


export default RestaurantList
