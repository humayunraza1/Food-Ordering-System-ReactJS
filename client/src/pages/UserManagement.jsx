import Grid from '@mui/material/Unstable_Grid2';
import Dashboard from '../components/Dashboard';
import UserDetails from '../components/UserDetails';
import styles from "./userManagement.module.css";
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ManageUsers from '../components/ManageUsers';
import ManageRestaurants from '../components/ManageRestaurants';
function UserManagement() {

    const user = useSelector((state) => state.fetchUser.user);
    const { ROLE } = user;
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const tabValue = searchParams.get('tab');
        const adValue = searchParams.get('ad');

        const UserTabValues = ['settings', 'order-history'];
        const AdminTabValues = ['manage-users', 'manage-restaurants', 'manage-orders'];

        if (tabValue === null && adValue === null) {
            setSearchParams({ tab: 'settings' });
        } else if (adValue === null) {
            if (!UserTabValues.includes(tabValue)) {
                setSearchParams({ tab: 'settings' });
            }
        }


        if (adValue !== null && ROLE === 'user') {
            setSearchParams({ tab: 'settings' });
        } else if (tabValue === null) {
            if (!AdminTabValues.includes(adValue)) {
                setSearchParams({ ad: 'manage-users' });
            }
        }
    }, [searchParams, setSearchParams, ROLE]);
    const tab = searchParams.get('tab');
    const ad = searchParams.get('ad');
    return (
        <div className={styles.userManagement}>

            <Grid container>
                <Grid xs={12} md={2}><Dashboard role={ROLE} setSearchParams={setSearchParams} searchParams={searchParams} /></Grid>
                <Grid xs={12} md={10}>{tab === "settings" && <UserDetails />} {ad === 'manage-users' && <ManageUsers />}{ad === 'manage-restaurants' && <ManageRestaurants />}</Grid>
            </Grid>
        </div>
    )
}

export default UserManagement
