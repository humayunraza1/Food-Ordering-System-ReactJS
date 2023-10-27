import styles from "./dashboard.module.css"
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import Drawer from '@mui/material/Drawer';
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from 'react-router-dom';
import { Divider } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useDispatch } from 'react-redux';

const drawerWidth = 240;
function Dashboard(props) {
    const { window } = props;
    const [searchParams, setSearchParams] = useSearchParams();
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    const dispatch = useDispatch();
    const token = sessionStorage.getItem('authToken');

    const drawer = (
        <Box onClick={handleDrawerToggle} className={styles.drawerContainer} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Button key='drawer1' sx={{ width: '100%', marginTop: '10px', height: '50px' }} color="secondary" startIcon={<SettingsIcon />} onClick={() => setSearchParams({ tab: 'settings' })}>
                Settings
            </Button>
            <Button key='drawer2' sx={{ width: '100%', marginTop: '10px', height: '50px' }} color="secondary" startIcon={<HistoryIcon />} onClick={() => setSearchParams({ tab: 'order-history' })}>
                Order History
            </Button>
            <Button key='drawer3' sx={{ width: '100%', marginTop: '10px', height: '50px' }} color="secondary" startIcon={<LogoutIcon />}>
                Logout
            </Button>
            {props.role === 'admin' && <>
                <Divider sx={{ width: '100%', height: '30px' }} />
                <p className={styles.admin}>Admin Controls</p>
                <Button key='drawer3' sx={{ width: '100%', marginTop: '10px', height: '50px' }} color="secondary" startIcon={<PersonIcon />}>
                    Manage Users
                </Button>
                <Button key='drawer3' sx={{ width: '100%', marginTop: '10px', height: '50px' }} color="secondary" startIcon={<StorefrontIcon />}>
                    Manage Restaurants
                </Button>
            </>}
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    async function getDetails() {
        const res = await fetch('http://localhost:3001/admin/admin-dashboard', {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            }
        });
        const data = await res.json();
        console.log(data);
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.heading}>
                <h1 onClick={() => navigate('/')}>
                    Foody Mart
                </h1>
                <div>
                    Eat That Foody.
                </div>
            </div>
            <div className={styles.btnContainer}>
                <Toolbar sx={{ width: '10' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' }, width: '1' }}>
                        <Button key='drawer1' sx={{ width: '100%', marginTop: '10px', height: '50px' }} color="secondary" startIcon={<SettingsIcon />} onClick={() => setSearchParams({ tab: 'settings' })}>
                            Settings
                        </Button>
                        <Button key='drawer2' sx={{ width: '100%', marginTop: '10px', height: '50px' }} color="secondary" startIcon={<HistoryIcon />} onClick={() => setSearchParams({ tab: 'order-history' })}>
                            Order History
                        </Button>
                        <Button key='drawer3' sx={{ width: '100%', marginTop: '10px', height: '50px' }} color="secondary" startIcon={<LogoutIcon />}>
                            Logout
                        </Button>
                        {props.role === 'admin' && <>
                            <Divider sx={{ width: '100%', height: '30px' }} />
                            <p className={styles.admin}>Admin Controls</p>
                            <Button key='drawer3' sx={{ width: '100%', marginTop: '10px', height: '50px' }} color="secondary" startIcon={<PersonIcon />} onClick={() => {
                                getDetails();
                                setSearchParams({ ad: 'manage-users' })
                            }}>
                                Manage Users
                            </Button>
                            <Button key='drawer3' sx={{ width: '100%', marginTop: '10px', height: '50px' }} color="secondary" startIcon={<StorefrontIcon />} onClick={() => setSearchParams({ ad: 'manage-restaurants' })}>
                                Manage Restaurants
                            </Button>
                        </>}
                    </Box>
                </Toolbar>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    key="right"
                    anchor="right"
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { sm: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </div>
        </div>
    )

}

export default Dashboard
