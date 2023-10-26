
import Settings from "./Settings"
import styles from "./userDetails.module.css"
import { useSelector } from "react-redux";
function UserDetails() {
    const user = useSelector((state) => state.user.user);
    return (
        <div className={styles.userContainer}>
            <Settings user={user} />
        </div>
    )
}

export default UserDetails
