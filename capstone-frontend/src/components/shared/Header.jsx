import { Link, useLocation } from "react-router-dom";
import { Avatar, Menu, MenuItem, IconButton, Typography, Divider, Badge } from "@mui/material";
import { useState } from "react";
import logo from "/Screenshot_3.png";
import Register from "./Register";
import Login from "./LoginIn";
import { BsBasket } from "react-icons/bs";
import { getCartItems } from "../../libs/cart";
export default function Header() {
    const dataItems = getCartItems()
    console.log("🚀 ~ Header ~ dataItems:", dataItems)
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user-automobile")); 
    const role = localStorage.getItem("user-role");
    const userRole = role && role.replace(/"/g, "");

    const isActive = (url) => location.pathname === url;

    const getLinkClassName = (url) =>
        `${isActive(url) ? "text-[#ff4d30]" : ""} hover:text-[#ff4d30] transition-all duration-300 ease-linear`;

    const navLink = [
        { id: 1, link: "Home", url: "/" },
        { id: 3, link: "Shop Now", url: "/products" },
        { id: 2, link: "Customization", url: "/custom" }
    ];

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user-automobile"); // Remove user details
        setAnchorEl(null);
        window.location.reload(); // Refresh to update UI
    };

    const path = location.pathname;
    if (path.startsWith("/dashboard")) {
        return
    }
    
    return (
        <header className="absolute inset-x-6 lg:inset-x-28 flex items-center justify-between z-50" id="top-header">
            <div>
                <Link to="/">
                    <img src={logo} alt="logo" width={140} height={140} />
                </Link>
            </div>
            <div className="flex items-center gap-x-4">

                <nav className="hidden sm:block">
                    <ul className="flex items-center gap-6 font-medium">
                        {navLink.map((data) => (
                            <li key={data.id}>
                                <Link to={data.url} className={getLinkClassName(data.url)}>
                                    {data.link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
               

                <div className="flex items-center gap-4 font-medium">
                    {token ? (
                        <>
                            {
                                (userRole == "CUSTOMER" || userRole =="GARAGE") &&
                            <Link to="/dashboard/cart">
                                <Badge badgeContent={Object.keys(dataItems).length} color="warning">
                                    <BsBasket size={22} />
                                </Badge>
                            </Link>
                            }
                            <IconButton
                                onClick={handleAvatarClick}
                                sx={{
                                    padding: 0,
                                    borderRadius: "50%",
                                    transition: "0.3s",
                                    "&:hover": { backgroundColor: "rgba(255, 77, 48, 0.1)" },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: "#ff4d30",
                                        color: "#fff",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                                </Avatar>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                sx={{
                                    "& .MuiPaper-root": {
                                        borderRadius: "10px",
                                        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                                        minWidth: "180px",
                                        padding: "8px 0",
                                    },
                                }}
                            >
                                <MenuItem sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                                    <Typography fontWeight="bold">{user?.fullName}</Typography>
                                    <Typography variant="body2" color="gray">{user?.email}</Typography>
                                </MenuItem>

                                <Divider />
                                {
                                    userRole =="CUSTOMER" ?

                                        <Link to={"/dashboard/my-orders"}>
                                    <MenuItem
                                        sx={{
                                            fontSize: "16px",
                                            color: "#ff4d30",
                                            "&:hover": { backgroundColor: "rgba(255, 77, 48, 0.1)" },
                                        }}
                                    >
                                        Your Orders
                                    </MenuItem>
                                </Link>
                                :
                                <Link to={"/dashboard"}>
                                    <MenuItem
                                        sx={{
                                            fontSize: "16px",
                                            color: "#ff4d30",
                                            "&:hover": { backgroundColor: "rgba(255, 77, 48, 0.1)" },
                                        }}
                                    >
                                        Your Dashboard
                                    </MenuItem>
                                </Link>

                                }
                                <MenuItem
                                    onClick={handleLogout}
                                    sx={{
                                        fontSize: "16px",
                                        color: "#ff4d30",
                                        "&:hover": { backgroundColor: "rgba(255, 77, 48, 0.1)" },
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Login />
                            <Register />
                        </>
                    )}
                </div>
            </div>

        </header>
    );
}
