import styles from "./register.module.css"
import RegisterForm from "../components/RegisterForm"

function Register() {
    return (
        <div className={styles.registerContainer}>
            <RegisterForm />
        </div>
    )
}

export default Register