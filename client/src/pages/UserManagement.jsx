import Grid from '@mui/material/Unstable_Grid2';
import Dashboard from '../components/Dashboard';
import UserDetails from '../components/UserDetails';
import styles from "./userManagement.module.css";
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
function UserManagement() {

    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.get('tab') === null) {
            setSearchParams({ tab: 'settings' })
        }
        console.log(searchParams.get('tab'))
    }, [searchParams, setSearchParams])
    const tab = searchParams.get('tab');
    return (
        <div className={styles.userManagement}>

            <Grid container>
                <Grid xs={12} md={2}><Dashboard setSearchParams={setSearchParams} searchParams={searchParams} /></Grid>
                <Grid xs={12} md={10}>{tab === "settings" && <UserDetails />}</Grid>
            </Grid>
        </div>
    )
}

export default UserManagement
