import styles from "./logoComp.module.css"

function logoComp({ children }) {
    return (
        <>
            <div className={styles.loginContainer}>
                <div className={styles.loginContents}>
                    <div className={styles.heading}>
                        <h1>
                            Foody Mart
                        </h1>
                        <div>
                            Eat That Foody.
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}

export default logoComp
