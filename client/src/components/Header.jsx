import styles from "./header.module.css";
import Search from "./Search.jsx";
import { useRef } from "react";

function Header({ searchText, titleRef }) {
    return (
        <>
            <header className={styles.header}>
                <div className={styles.headerComponents}>
                    <div className={styles.headerTitle} ref={titleRef}>

                        <h1>Foody Mart</h1>
                        <div>
                            <p>Eat That Foody.</p>
                        </div>
                    </div>
                    <Search searchText={searchText} />
                </div>
            </header>
        </>
    )
}

export default Header
