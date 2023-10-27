import styles from "./header.module.css";
import Search from "./Search.jsx";
import RestaurantIcon from '@mui/icons-material/Restaurant';

function Header({ searchText, titleRef }) {
    return (
        <>
            <header className={styles.header}>
                <div className={styles.headerComponents}>
                    <div className={styles.headerTitle} ref={titleRef}>

                        <h1>Foody Mart</h1>
                        <div>
                            <p>Eat That Foody.</p>
                        </div>
                    </div>
                    <Search startIcon={<RestaurantIcon className={styles.icon} />} searchText={searchText} placeholder="Favorite Restaurant Or Food..." />
                </div>
            </header>
        </>
    )
}

export default Header
