import LoginForm from "../components/LoginForm"
import styles from "./login.module.css"


function Login({ setLoggedIn }) {
    return (
        <div className={styles.loginContainer}>
            <LoginForm setLoggedIn={setLoggedIn} />
        </div>
    )
}


export default Login
