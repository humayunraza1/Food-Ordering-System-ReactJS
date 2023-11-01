import { useRef, useState, useEffect } from "react"
import Header from "../components/Header"
import styles from "./home.module.css"
import Navbar from "../components/Navbar";
import { useInView } from 'react-intersection-observer';
import RestaurantList from "../components/RestaurantList";

function Home({ isLoggedIn, setLoggedIn, info }) {
    const searchText = useRef("");
    const token = sessionStorage.getItem('authToken');
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isTitleVisible, setIsTitleVisible] = useState(true);
    const [titleRef, inView] = useInView({
        threshold: 0.5, // Adjust the threshold as needed
    });


    useEffect(() => {
        setIsTitleVisible(!inView);
    }, [inView]);

    useEffect(() => {
        setLoading(true);
        async function getRestaurants() {
            const res = await fetch('http://192.168.18.139:3001/users/home', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            setRestaurants(data.data);
            setFilteredRestaurants(data.data);
            setTimeout(() => {
                setLoading(false);
            }, 1000)
        }
        getRestaurants()
    }, [])
    return (
        <div className={styles.homeContainer}>
            <Navbar isTitleVisible={isTitleVisible} isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} info={info} />
            <Header titleRef={titleRef} searchText={searchText} />
            <RestaurantList restaurants={restaurants} filteredRestaurants={filteredRestaurants} setFilteredRestaurants={setFilteredRestaurants} />
        </div>
    )
}

export default Home
