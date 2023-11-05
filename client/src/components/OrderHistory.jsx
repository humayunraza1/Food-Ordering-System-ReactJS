import { useEffect, useState } from "react"
import styles from "./orderHistory.module.css"
import { Box, Button, Grid, Tooltip, IconButton, Zoom, Pagination } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Skeleton from '@mui/material/Skeleton'


import Ripple from "./Ripple";
import ModalBox from "./Modal";
const token = sessionStorage.getItem('authToken');
function OrderHistory() {

    const [orders, setOrders] = useState([])
    const [Active, setActive] = useState([]);
    const [Color, setColor] = useState([]);
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState({});
    const [items, setItems] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [loading, setLoading] = useState(false);
    //Active Orders Pagination
    const [page1, setPage1] = useState(1);
    const itemsPerPage1 = 3; // Number of items to display per page
    const totalPages1 = Math.ceil(Active.length / itemsPerPage1); // Calculate the total number of pages
    const startIndex1 = (page1 - 1) * itemsPerPage1; // Calculate the starting index for the current page
    const visibleActive = Active.slice(startIndex1, startIndex1 + itemsPerPage1); // Get the products to display on the current page
    //Past Orders Pagination
    const [page2, setPage2] = useState(1);
    const itemsPerPage2 = 3; // Number of items to display per page
    const totalPages2 = Math.ceil(completed.length / itemsPerPage2); // Calculate the total number of pages
    const startIndex2 = (page2 - 1) * itemsPerPage2; // Calculate the starting index for the current page
    const visibleCompleted = completed.slice(startIndex2, startIndex2 + itemsPerPage2); // Get the products to display on the current page

    useEffect(() => {
        setLoading(true);
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
            setTimeout(() => {
                setLoading(false)
            }, 2000)
            if (data.status === 'error') {
                setOrders([]);
            }
            console.log(data);
        }
        getHistory();
    }, [])

    async function getDetails(orderid) {
        const res = await fetch(`http://192.168.18.139:3001/users/orderDetails?orderid=${orderid}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json();
        setDetails(data.data[0])
        setItems(data.data);
        if (data.status === 'success') {
            setOpen(true);
        }
        console.log(data);
    }
    const handlePageChange1 = (event, value) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setPage1(value);
    };
    const handlePageChange2 = (event, value) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setPage2(value);
    };
    return (
        <>
            {open && <ModalBox open={open} setOpen={setOpen}>
                <Grid container >
                    <Grid xs={12} display={'flex'} justifyContent={'end'}>
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <Grid xs={12}>
                        <h3>Order Details</h3>
                    </Grid>
                    <Grid xs={12}>
                        Status: {details.ORDERSTATUS}
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
            </ModalBox>}
            <div className={styles.orderHistory}>
                <div className={styles.content}>
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
                        {orders.length === 0 ? (
                            <p>No orders to show</p>
                        ) : (visibleActive.map((order, i) => (
                            (loading ? <Skeleton key={i} animation="wave" variant="rounded" sx={{ width: { md: 650, sm: 650, xs: 400 } }} height={100} /> :
                                <Zoom in={true}>
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
                                                <Grid xs={12} display={'flex'} justifyContent={'space-around'} alignItems={'end'}><Button color="secondary" onClick={() => getDetails(order.ORDERID)}>Details</Button></Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                </Zoom>)
                        )))}
                        <Grid xs={12} display={'flex'} justifyContent={'center'}>
                            <Pagination page={page1} count={totalPages1} onChange={handlePageChange1} color="secondary" />
                        </Grid>
                        <Grid container xs={12}>
                            <Grid sm={12}>
                                <h1>Past Orders ({completed.length})</h1>
                            </Grid>
                            {completed.length === 0 ? <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <h1 style={{ color: 'grey', opacity: 0.5, fontWeight: 400, fontSize: '3rem' }}>No past orders</h1>
                            </div>
                                :
                                (visibleCompleted.map((order, i) => (
                                    (loading ? <Skeleton key={i} animation="wave" variant="rounded" sx={{ width: { md: 650, sm: 650, xs: 400 }, marginBottom: '15px' }} height={100} /> :
                                        <Zoom in={true}>
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
                                                        <Grid xs={12} display={'flex'} justifyContent={'space-around'} alignItems={'end'}><Button color="secondary" onClick={() => getDetails(order.ORDERID)}>Details</Button></Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Zoom>
                                    )
                                )))
                            }
                            <Grid xs={12} display={'flex'} justifyContent={'center'}>
                                <Pagination page={page2} count={totalPages2} onChange={handlePageChange2} color="secondary" />
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    )
}

export default OrderHistory
