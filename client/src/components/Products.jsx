import { useEffect, useRef, useState } from "react";
import Search from "./Search"
import styles from "./products.module.css"
import InventoryIcon from '@mui/icons-material/Inventory';
import { Alert, Box, Button, Fab, FilledInput, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Skeleton, TextField, Tooltip, Zoom } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ModalBox from "./Modal";
import AlertBar from "./AlertBar";
import DeleteIcon from '@mui/icons-material/Delete';


const token = sessionStorage.getItem('restToken');

const categories = [
    {
        value: 'Chicken'
    },
    {
        value: 'Beef'
    },
    {
        value: 'Beverages'
    },
    {
        value: 'Dessert'
    },
    {
        value: 'Sides'
    }
];

function Products() {
    const searchText = useRef();
    const [open, setOpen] = useState(false);
    const InitialState = { name: null, description: null, category: null, price: null };
    const [details, setDetails] = useState(InitialState)
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [status, setStatus] = useState({ status: '', msg: '' });
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    async function getProducts() {
        setLoading(true);
        const res = await fetch('http://192.168.18.139:3001/restaurants/products', {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json();
        setProducts(data.data);
        setFilteredProducts(data.data);
        setTimeout(() => {
            setLoading(false);
        }, 1000)

    }

    useEffect(() => {
        getProducts();
    }, [])


    function handleSearch() {
        setLoading(true);
        const { value } = searchText.current;
        const searchValue = value.toLowerCase(); // Convert search value to lowercase

        const newArr = products.filter((product) => {
            const productName = product.NAME.toLowerCase(); // Convert product name to lowercase
            const productCategory = product.CATEGORY.toLowerCase(); // Convert product category to lowercase
            if (productName.includes(searchValue) || productCategory.includes(searchValue)) {
                return product;
            }
        })
        setFilteredProducts(newArr);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    async function addProduct() {
        console.log(details)
        setShow(false);
        setLoading(true);
        const res = await fetch('http://192.168.18.139:3001/restaurants/products', {
            method: 'POST',
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: details.name,
                description: details.description,
                category: details.category,
                price: details.price
            })
        })

        const data = await res.json();
        setTimeout(() => {
            setStatus({ status: data.status, msg: data.message });
            if (data.status === 'success') {
                setShow(true);
                setTimeout(() => {
                    setOpen(false);
                    setLoading(false)
                    setDetails(InitialState);
                }, 500)
            } else {
                setShow(true);
                setLoading(false);
            }
        }, 1200)
        console.log(data);
    }

    return (
        <>
            {open && <ModalBox open={open} setOpen={setOpen}>
                {show && <AlertBar status={status.status} msg={status.msg} />}
                <h2>Add Product</h2>
                <TextField disabled={loading} color="secondary" id="filled-basic" label="Name" variant="filled" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
                <TextField disabled={loading} color="secondary" id="filled-basic" label="Description" variant="filled" value={details.description} onChange={(e) => setDetails({ ...details, description: e.target.value })} />
                <FormControl disabled={loading} color="secondary" variant="filled">
                    <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
                    <FilledInput
                        id="filled-adornment-amount"
                        value={details.price}
                        onChange={(e) => { setDetails({ ...details, price: e.target.value }) }}
                        startAdornment={<InputAdornment position="start">Rs</InputAdornment>}
                    />
                </FormControl>
                <TextField
                    disabled={loading}
                    id="filled-select-category"
                    color="secondary"
                    select
                    label="Category"
                    value={details.category}
                    onChange={(e) => { setDetails({ ...details, category: e.target.value }) }}
                    defaultValue=''
                    helperText="Please select product category"
                    variant="filled"
                >
                    {categories.map((option, j) => (
                        <MenuItem key={j} value={option.value}>
                            {option.value}
                        </MenuItem>
                    ))}
                </TextField>
                <Button disabled={loading} color="secondary" variant="contained" onClick={addProduct}>ADD</Button>
            </ModalBox>}
            <div className={styles.search}>
                <Search searchText={searchText} onSearch={handleSearch} startIcon={<InventoryIcon />} placeholder="Search for products...." />
            </div>
            <Tooltip disableFocusListener placement="top" aria-label="Add Product" title="Add Restaurant" >
                <Fab onClick={() => setOpen(true)} color="secondary" sx={{ position: 'fixed', bottom: '40px', right: '40px' }}><InventoryIcon /><AddIcon /></Fab>
            </Tooltip>
            <div className={styles.usersList}>
                {filteredProducts.length === 0 ? <div className={styles.noRes}><p>No restaurants to show</p></div> :
                    <Grid container sx={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} rowGap={5} columnGap={5} xs={12}>
                        {(filteredProducts.map((product, h) => {
                            return <Grid item xs={12} sm={6} md={4} lg={3} key={h}>

                                {loading ? <Skeleton key={h} animation="wave" variant="rounded" height={'250px'} /> :
                                    <Zoom in={true}>
                                        <Box key={h} sx={{ paddingTop: '20px' }} className={styles.userBox}>
                                            <Grid xs={12}>
                                                <Grid xs={12} height='100%' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', lineHeight: '35px' }}>

                                                    <p style={{ fontSize: '3.1rem', opacity: '0.5', color: 'grey' }}>{product.PRODUCTID}</p>
                                                    <p style={{ fontSize: '0.8rem', opacity: '0.5', color: 'grey' }}>Product ID</p>
                                                </Grid>
                                                <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', rowGap: '10px', fontSize: '0.9rem', lineHeight: '20px' }}>
                                                    <p>Product: {product.NAME}</p>
                                                    <p>Description: {product.DESCRIPTION}</p>
                                                    <p>Catgory: {product.CATEGORY}</p>
                                                    <p>Price: Rs{product.PRICE}</p>
                                                </Grid>
                                                <Grid xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                                                    <Box>
                                                        <IconButton color="error" aria-label="delete" onClick={() => {
                                                            setShow(false);
                                                        }}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Zoom>
                                }
                            </Grid>
                        }))}
                    </Grid>
                }
            </div>
        </>
    )
}

export default Products
