import { useRef, useState, useEffect } from "react"
import Header from "../components/Header"
import styles from "./home.module.css"
import Navbar from "../components/Navbar";
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { Button } from "@mui/material";

function Home({ isLoggedIn, setLoggedIn, info }) {
    const searchText = useRef("");
    const user = useSelector((state) => state);
    const [isTitleVisible, setIsTitleVisible] = useState(true);
    const [titleRef, inView] = useInView({
        threshold: 0.5, // Adjust the threshold as needed
    });


    useEffect(() => {
        setIsTitleVisible(!inView);
    }, [inView]);
    return (
        <div className={styles.homeContainer}>
            <Navbar isTitleVisible={isTitleVisible} isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} info={info} />
            <Header titleRef={titleRef} searchText={searchText} />
        </div>
    )
}

export default Home
