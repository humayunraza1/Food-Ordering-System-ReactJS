import { useEffect, useState } from "react"
import styles from "./orderHistory.module.css"
import { Box, Button, Grid, Tooltip } from "@mui/material";
import Ripple from "./Ripple";
const token = sessionStorage.getItem('authToken');
function OrderHistory() {

    const [orders, setOrders] = useState([])
    const [Active, setActive] = useState([]);
    const [Color, setColor] = useState([]);
    const [completed, setCompleted] = useState([]);
    useEffect(() => {
        async function getHistory() {
            setActive([])
            const res = await fetch('http://192.168.18.139:3001/users/orderHistory', {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            if (data.status === 'success') {
                setOrders(data.data);
                data.data.filter((order) => {
                    if (order.ORDERSTATUS === 'In Progress') {
                        setActive((prev) => [...prev, order])
                        return setColor((prev) => [...prev, '#81b214']);
                    } else
                        if (order.ORDERSTATUS === 'Processing') {
                            setActive((prev) => [...prev, order])
                            return setColor((prev) => [...prev, '#ff7a00']);
                        } else if (order.ORDERSTATUS === 'Delivered') {
                            return setCompleted((prev) => [...prev, order])
                        }
                })
            }
            if (data.status === 'error') {
                setOrders([]);
            }
            console.log(data);
        }
        getHistory();
    }, [])

    return (
        <div className={styles.orderHistory}>
            <div className={styles.content}>
                {orders.length === 0 ? (
                    <p>No orders to show</p>
                ) : (
                    <Grid container maxWidth={'650px'} marginTop={'50px'} rowGap={2}>
                        <Grid container xs={12}>
                            <Grid sm={6}>
                                <h1>Active Orders ({Active.length})</h1>
                            </Grid>
                            <Grid container display={'flex'} columnGap={2} sm={6}>
                                <Grid sm={4}>
                                    <Ripple color='#ff7a00' /> Processing
                                </Grid>
                                <Grid sm={4}>
                                    <Ripple color='#81b214' /> In Progress
                                </Grid>
                            </Grid>
                        </Grid>
                        {Active.map((order, i) => (
                            <Grid className={styles.orderItem} item key={i} xs={12} height={'100px'} sx={{ marginBottom: '10px', borderRadius: '10px' }} display={'flex'} alignItems={'center'}>
                                <Grid container xs={12}>
                                    <Grid item xs={2} textAlign={'center'} color={'grey'} sx={{ opacity: '0.5' }}>
                                        <div style={{ fontSize: '2rem' }}>{order.ORDERID}</div>
                                        <div>Order ID</div>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <div>{order.RESTAURANTNAME}</div>
                                        <div>{order.ORDERTIMEDATE}</div>
                                        <div>Rs{order.GRANDTOTAL}</div>
                                    </Grid>
                                    <Grid container columnGap={1} xs={3}>
                                        <Tooltip title={order.ORDERSTATUS} placement="right">
                                            <Grid xs={12} display={'flex'} sx={{ height: '50px' }} alignItems={'center'} justifyContent={'center'}><Ripple color={Color[i]} /></Grid>
                                        </Tooltip>
                                        <Grid xs={12} display={'flex'} justifyContent={'space-around'} alignItems={'end'}><Button color="secondary" onClick={() => {
                                            console.log(completed)
                                            console.log(Active)
                                        }}>Details</Button></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                        <Grid container xs={12}>
                            <Grid sm={12}>
                                <h1>Past Orders ({completed.length})</h1>
                            </Grid>
                            {completed.length === 0 ? <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <h1 style={{ color: 'grey', opacity: 0.5, fontWeight: 400, fontSize: '3rem' }}>No past orders</h1>
                            </div>
                                :
                                (completed.map((order, i) => (
                                    <Grid className={styles.orderItem} item key={i} xs={12} height={'100px'} sx={{ marginBottom: '10px', borderRadius: '10px' }} display={'flex'} alignItems={'center'}>
                                        <Grid container xs={12}>
                                            <Grid item xs={2} textAlign={'center'} color={'grey'} sx={{ opacity: '0.5' }}>
                                                <div style={{ fontSize: '2rem' }}>{order.ORDERID}</div>
                                                <div>Order ID</div>
                                            </Grid>
                                            <Grid item xs={7}>
                                                <div>{order.RESTAURANTNAME}</div>
                                                <div>{order.ORDERTIMEDATE}</div>
                                                <div>Rs{order.GRANDTOTAL}</div>
                                            </Grid>
                                            <Grid container columnGap={1} xs={3}>
                                                <Grid xs={12} display={'flex'} justifyContent={'space-around'} alignItems={'end'}><Button color="secondary" onClick={() => {
                                                    console.log(completed)
                                                    console.log(Active)
                                                }}>Details</Button></Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )))
                            }
                        </Grid>
                    </Grid>
                )}
            </div>
        </div>
    )
}

export default OrderHistory
