import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const role = localStorage.getItem("user-role");
    const token = localStorage.getItem("token");
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!role || !token) {
            navigate("/");
        }
    }, [role, token, navigate]);

    if (!role || !token) return null;

    const userRole = role.replace(/"/g, "");

    const customerLinks = [
        { Name: "Dashboard", Link: "/dashboard" },
        { Name: "My Orders", Link: "/dashboard/my-orders" },
        { Name: "My Cart", Link: "/dashboard/cart" },
    ];

    const suplierLinks = [
        { Name: "Dashboard", Link: "/dashboard" },
        { Name: "Manage Products", Link: "/dashboard/my-products" },

    ];
    const garageLinks = [
        { Name: "Dashboard", Link: "/dashboard" },
        { Name: "My Order", Link: "/dashboard/my-orders" },
        { Name: "Manage Customers", Link: "/dashboard/my-customers" },
    ];



    const adminLinks = [
        { Name: "Dashboard", Link: "/dashboard" },
        { Name: "Manage Users", Link: "/dashboard/users" },
        { Name: "Manage Brands", Link: "/dashboard/brands" },
        { Name: "Manage Products", Link: "/dashboard/products" },
        { Name: "Manage Orders", Link: "/dashboard/orders" },
    ];

    let userLinks = [];
    switch (userRole) {
        case "CUSTOMER":
            userLinks = customerLinks;
            break;
        case "SUPPLIER":
            userLinks = suplierLinks;
            break;
        case "GARAGE":
            userLinks = garageLinks;
            break;
        case "ADMIN":
            userLinks = adminLinks;
            break;
        default:
            userLinks = [];
            break;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user-automobile");
        localStorage.removeItem("user-role");
        navigate("/");
        window.location.reload();
    };

    const toggleMobileDrawer = (open) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setMobileOpen(open);
    };

    const sidebarContent = (
        <div className="flex flex-col w-full h-full justify-between">
            <div>
                <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center"
                >
                    <img src="/Screenshot_3.png" alt="Logo" className="h-28 bg-blend-multiply" />
                </Link>

                <h2 className="mt-8 px-4 text-start font-semibold text-xl">
                    My Dashboard
                </h2>

                <nav>
                    <ul className="mt-4 space-y-2 px-4">
                        {userLinks.map((linkItem, index) => (
                            <li key={index}>
                                <NavLink
                                    to={linkItem.Link}
                                    onClick={() => setMobileOpen(false)}
                                    className={
                                        ` p-2 rounded-full flex items-center justify-center transition-colors text-start ${linkItem.Link == path
                                            ? "bg-[#ff4d30] text-white"
                                            : "text-black hover:bg-[#ff4d30] hover:text-white"
                                        }`
                                    }
                                >
                                    {linkItem.Name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <button
                onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                }}
                className="mt-6 flex cursor-pointer items-center gap-2 justify-center w-full bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
    );

    return (
        <>
            <aside className="hidden md:flex w-64 flex-col items-start justify-between h-screen bg-[#F0F0F0] text-black p-4 fixed">
                {sidebarContent}
            </aside>

            <div className="flex md:hidden items-center justify-between p-4 bg-gray-200 fixed top-0 w-full z-50 shadow">
                <Link to="/" className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="h-10" />
                </Link>
                <IconButton onClick={toggleMobileDrawer(true)} aria-label="open drawer">
                    <MenuIcon />
                </IconButton>
            </div>

            <Drawer
                anchor="bottom"
                open={mobileOpen}
                onClose={toggleMobileDrawer(false)}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <div className="h-screen p-4 bg-gray-200">{sidebarContent}</div>
            </Drawer>
        </>
    );
};

export default Sidebar;