import styles from "./navbar.module.css"
import Button from '@mui/material/Button';
import Zoom from '@mui/material/Zoom';
const btnStyle = {
    color: 'common.black',
    bgcolor: "white",
    '&:hover': {
        bgcolor: "#F0F0F0",
        boxShadow: 0,
    },
    boxShadow: 0,
};

function Navbar({ isTitleVisible }) {
    return (
        <nav className={styles.nav}>
            <div className={styles.navbox1}>

            </div>
            <div className={styles.navbox2}>
                {isTitleVisible && <Zoom in={isTitleVisible}>
                    <h1>
                        Foody Mart
                    </h1>
                </Zoom>
                }
            </div>
            <div className={styles.navbox3}>
                <Button className={styles.btn} variant="contained" sx={btnStyle}>Login/Register</Button>
            </div>
        </nav>

    )
}

export default Navbar
