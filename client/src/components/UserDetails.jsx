
import Settings from "./Settings"
import styles from "./userDetails.module.css"
import { useSelector } from "react-redux";
function UserDetails({ children }) {

    return (
        <div className={styles.userContainer}>
            {children}
        </div>
    )
}

export default UserDetails
