import styles from "./Ripple.module.css"
function Ripple({ color }) {
    return (
        <div className={styles.rippleContainer}>
            <span className={styles.ripple} style={{ backgroundColor: color }}></span>
        </div>
    )
}

export default Ripple
