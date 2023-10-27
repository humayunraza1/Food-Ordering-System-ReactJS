import { useEffect, useRef, useState } from "react"
import Skeleton from '@mui/material/Skeleton'
import styles from "./manageUser.module.css"
import Search from "./Search"
import { Box, Grid, Pagination, Zoom } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AlertBar from "./AlertBar";
const token = sessionStorage.getItem('authToken');

function ManageUsers() {

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); // New state for filtered users
    const itemsPerPage = 6; // Number of items to display per page
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage); // Calculate the total number of pages
    const [currentPage, setCurrentPage] = useState(1);
    const [Status, setStatus] = useState({ status: '', msg: '' });
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const searchText = useRef();
    const startIndex = (currentPage - 1) * itemsPerPage; // Calculate the starting index for the current page
    const visibleUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage); // Get the products to display on the current page

    async function getDetails() {
        const res = await fetch('http://localhost:3001/admin/admin-dashboard', {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            }
        });
        const data = await res.json();
        setUsers(data.data.users);
        setFilteredUsers(data.data.users);
        setTimeout(() => {
            setLoading(false)
        }, 5000)
    }

    useEffect(() => {
        getDetails()
    }, []);

    async function searchUser() {
        const { value } = searchText.current;
        const newArr = users.filter((user) => {
            if (user.EMAIL.includes(value) || user.FULLNAME.includes(value)) {
                return user
            }
        })
        setLoading(true)
        setFilteredUsers(newArr);
        setTimeout(() => {
            setLoading(false);
        }, 2500)

    }

    const handlePageChange = (event, value) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentPage(value);
    };


    async function deleteUser(userId) {
        setLoading(true)
        const res = await fetch(`http://localhost:3001/admin/remove-user?userid=${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            }
        })
        const data = await res.json();
        setStatus({ status: data.status, msg: data.message });
        setTimeout(() => {
            setLoading(false);
            setShow(true);
        }, 2000)
        console.log(data)
        getDetails();
    }

    return (
        <div className={styles.userContainer}>
            {show && <AlertBar status={Status.status} msg={Status.msg} />}
            <div className={styles.searchContainer}>
                <Search searchText={searchText} onSearch={searchUser} startIcon={<SearchIcon />} placeholder="Search user's name or email" />
            </div>
            <div className={styles.usersList}>
                {visibleUsers.map((user, h) => {
                    return <>
                        {loading ? <Skeleton key={h} animation="wave" variant="rounded" sx={{ width: { md: 510, sm: 410, xs: 350 } }} height={100} /> :
                            <Zoom in={true}>
                                <Box key={h} sx={{ width: { md: 510, sm: 410, xs: 350 }, height: 100 }} className={styles.userBox}>
                                    <Grid container sx={{ height: '100%' }}>
                                        <Grid xs={2} height='100%' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', lineHeight: '35px' }}>

                                            <p style={{ fontSize: '3.1rem', opacity: '0.5', color: 'grey' }}>{user.USERID}</p>
                                            <p style={{ fontSize: '0.8rem', opacity: '0.5', color: 'grey' }}>User ID</p>
                                        </Grid>
                                        <Grid xs={8} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', rowGap: '10px', fontSize: '0.9rem', lineHeight: '20px' }}>
                                            <p>Name: {user.FULLNAME}</p>
                                            <p>Email: {user.EMAIL}</p>
                                            <p>Number: {user.PHONE_NUMBER}</p>
                                        </Grid>
                                        <Grid xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                            <IconButton color="error" aria-label="delete" onClick={() => {
                                                setShow(false);
                                                deleteUser(user.USERID)
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Zoom>

                        }
                    </>
                })}
                <Pagination page={currentPage} count={totalPages} onChange={handlePageChange} color="secondary" />
            </div>
        </div>
    )
}

export default ManageUsers
