import { useRef, useState, useEffect } from "react"
import Header from "../components/Header"
import styles from "./home.module.css"
import Navbar from "../components/Navbar";
import { useInView } from 'react-intersection-observer';

function Home() {
    const searchText = useRef("");
    const [isTitleVisible, setIsTitleVisible] = useState(true);
    const [titleRef, inView] = useInView({
        threshold: 0.5, // Adjust the threshold as needed
    });

    useEffect(() => {
        setIsTitleVisible(!inView);
    }, [inView]);

    return (
        <div>
            <Navbar isTitleVisible={isTitleVisible} />
            <Header titleRef={titleRef} searchText={searchText} />
        </div>
    )
}

export default Home
