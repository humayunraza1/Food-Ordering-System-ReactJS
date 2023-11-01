import Grid from '@mui/material/Unstable_Grid2';
import UserDetails from '../components/UserDetails';
import styles from "./userManagement.module.css";
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import ManageUsers from '../components/ManageUsers';
import RestaurantDash from '../components/RestaurantDash';
import Products from "../components/Products"
function RestaurantManagement() {

    // const user = useSelector((state) => state.fetchUser.user);
    // const { ROLE } = user;
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const tabValue = searchParams.get('res');
        const RestaurantTabValues = ['products', 'orders'];

        if (tabValue === null) {
            setSearchParams({ res: 'products' });
        } else {
            if (!RestaurantTabValues.includes(tabValue)) {
                setSearchParams({ res: 'products' });
            }
        }

    }, [searchParams, setSearchParams]);
    const res = searchParams.get('res');
    return (
        <div className={styles.userManagement}>
            <Grid container>
                <Grid xs={12} md={2}><RestaurantDash setSearchParams={setSearchParams} searchParams={searchParams} /></Grid>
                <Grid xs={12} md={10}>{res === "products" && <UserDetails><Products /></UserDetails>} {res === 'orders' && <ManageUsers />}</Grid>
            </Grid>
        </div>
    )
}

export default RestaurantManagement
