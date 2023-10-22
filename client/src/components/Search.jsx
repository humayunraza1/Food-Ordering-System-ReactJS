import styles from "./search.module.css"
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { purple } from '@mui/material/colors';
import Fab from '@mui/material/Fab';

const fabStyle = {
    color: 'common.white',
    zIndex: 0,
    bgcolor: purple[500],
    '&:hover': {
        bgcolor: purple[600],
    },
};
function Search({ searchText }) {
    function handleClick() {
        console.log(searchText.current.value)
    }
    return (
        <div className={styles.inputWrapper}>
            <RestaurantIcon className={styles.icon} />
            <input ref={searchText} className={styles.inputBar} placeholder="Favorite Restaurant Or Food..."></input>
            <Fab sx={fabStyle} className={styles.fabBtn} onClick={handleClick}>
                GO
            </Fab>
        </div>
    )
}

export default Search;
