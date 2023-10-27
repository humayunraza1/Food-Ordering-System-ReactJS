import styles from "./search.module.css"
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
function Search({ searchText, placeholder, startIcon, onSearch }) {

    return (
        <div className={styles.inputWrapper}>
            {startIcon}
            <input ref={searchText} className={styles.inputBar} placeholder={placeholder}></input>
            <Fab sx={fabStyle} className={styles.fabBtn} onClick={onSearch}>
                GO
            </Fab>
        </div>
    )
}

export default Search;
