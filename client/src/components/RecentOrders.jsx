import { useEffect, useState } from "react"
import styles from "./orderHistory.module.css"
import { Box, Button, Grid, IconButton, Skeleton, Tooltip, Zoom } from "@mui/material";
import Ripple from "./Ripple";
import ModalBox from "./Modal"
import CloseIcon from '@mui/icons-material/Close';

const token = sessionStorage.getItem('restToken');
function RecentOrders() {

    const [orders, setOrders] = useState([])
    const [Color, setColor] = useState([]);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [details, setDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(0)
    useEffect(() => {
        setLoading(true);
        async function getHistory() {
            const res = await fetch('http://192.168.18.139:3001/restaurants/orders', {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            console.log("recent orders: ", data.data)
            if (data.status === 'success') {
                setOrders(data.data);
                data.data.filter((order) => {
                    if (order.ORDERSTATUS === 'In Progress') {
                        return setColor((prev) => [...prev, '#81b214']);
                    }
                    if (order.ORDERSTATUS === 'Processing') {
                        return setColor((prev) => [...prev, '#ff7a00']);
                    }
                })
            }
            if (data.status === 'error') {
                setOrders([]);
            }
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        }
        getHistory();
    }, [])


    async function getDetails(orderID) {
        setOpen(true);
        setOrderId(orderID);
        const res = await fetch(`http://192.168.18.139:3001/restaurants/get-details?orderid=${orderID}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()
        setItems(data.data)
        setDetails(data.data[0]);
        console.log("order details: ", data.data);
    }

    async function updateStatus() {
        const res = await fetch('http://192.168.18.139:3001/restaurants/orders', {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderid: orderId
            })
        })
        const data = await res.json();
        console.log(data);
    }
    return (
        <>
            {open && <ModalBox open={open} setOpen={setOpen}>
                <Grid container >
                    <Grid xs={12} display={'flex'} justifyContent={'end'}>
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <Grid container xs={12}>
                        <Grid xs={12}>
                            <h3>Customer Information</h3>
                        </Grid>
                        <Grid xs={6}>
                            Name: {details.FULLNAME}
                        </Grid>
                        <Grid xs={6}>Ph#:{details.PHONE_NUMBER}</Grid>
                        <Grid xs={12}>Address:{details.ADDRESS}</Grid>
                    </Grid>
                    <Grid xs={12}>
                        <h3>Order Details</h3>
                    </Grid>
                    <Grid container xs={12} borderBottom={'dotted'} fontWeight={'500'} marginBottom={'10px'}>
                        <Grid xs={6}>
                            Item
                        </Grid>
                        <Grid xs={6} textAlign={'end'}>Qty</Grid>
                    </Grid>
                    <Grid container xs={12} marginBottom={'5px'}>
                        {items.map((item, h) => {
                            return <>
                                <Grid xs={6}>{item.NAME}</Grid>
                                <Grid xs={6} textAlign={'end'}>{item.QUANTITY}x</Grid>
                            </>
                        })}
                    </Grid>
                    <Grid xs={6}>Total:</Grid>
                    <Grid xs={6} textAlign={'end'}>Rs{details.GRANDTOTAL}</Grid>
                </Grid>
                <Grid xs={12} display={'flex'} justifyContent={'center'}><Button variant="contained" color="secondary" onClick={updateStatus}>Update Status</Button></Grid>
            </ModalBox>}
            <div className={styles.orderHistory}>
                <div className={styles.content}>
                    <Grid container maxWidth={'650px'} marginTop={'50px'} rowGap={2}>
                        <Grid container xs={12}>
                            <Grid sm={6}>
                                <h1>Recent Orders ({orders.length})</h1>
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
                        {orders.length === 0 ? (
                            <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <h1 style={{ color: 'grey', opacity: 0.5, fontWeight: 400, fontSize: '3rem' }}>No active orders</h1>
                            </div>
                        ) : (
                            orders.map((order, i) => (
                                (loading ? <Skeleton key={i} animation="wave" variant="rounded" sx={{ width: { md: 650, sm: 650, xs: 400 } }} height={100} /> : <Zoom in={true}>
                                    <Grid className={styles.orderItem} item key={i} xs={12} height={'100px'} sx={{ marginBottom: '10px', borderRadius: '10px' }} display={'flex'} alignItems={'center'}>
                                        <Grid container xs={12}>
                                            <Grid item xs={2} textAlign={'center'} color={'grey'} sx={{ opacity: '0.5' }}>
                                                <div style={{ fontSize: '2rem' }}>{order.ORDERID}</div>
                                                <div>Order ID</div>
                                            </Grid>
                                            <Grid item xs={7} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <div>{order.ORDERTIMEDATE}</div>
                                                <div>Rs{order.GRANDTOTAL}</div>
                                            </Grid>
                                            <Grid container columnGap={1} xs={3}>
                                                <Tooltip title={order.ORDERSTATUS} placement="right">
                                                    <Grid xs={12} display={'flex'} sx={{ height: '50px' }} alignItems={'center'} justifyContent={'center'}><Ripple color={Color[i]} /></Grid>
                                                </Tooltip>
                                                <Grid xs={12} display={'flex'} justifyContent={'space-around'} alignItems={'end'}><Button color="secondary" onClick={() => getDetails(order.ORDERID)}>Details</Button></Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Zoom>)
                            ))
                        )
                        }
                    </Grid>
                </div>
            </div>
        </>
    )
}

export default RecentOrders
