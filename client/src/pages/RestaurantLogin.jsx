import LoginForm from "../components/LoginForm"
import styles from "./login.module.css"


function RestaurantLogin() {
    return (
        <div className={styles.loginContainer}>
            <LoginForm apiURL="http://192.168.18.139:3001/restaurants/login" Type="Restaurant" />
        </div>
    )
}


export default RestaurantLogin
