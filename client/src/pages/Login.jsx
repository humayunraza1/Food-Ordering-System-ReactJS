import styles from "./login.module.css"
import LoginForm from "../components/LoginForm"

function Login() {
    return (
        <div className={styles.loginPage}>
            <LoginForm />
        </div>
    )
}

export default Login