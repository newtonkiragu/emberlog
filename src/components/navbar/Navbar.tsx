"use client";

import {useState} from "react";
import {useSession, signOut} from "next-auth/react";
import {usePathname, useRouter} from "next/navigation";
import {
    FiMenu,
    FiHome,
    FiBook,
    FiSearch,
    FiSettings,
    FiLogOut, FiX, FiBarChart2,
} from "react-icons/fi";
import "./style.css";

const Navbar = () => {
    const {data: session} = useSession();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(true);
    const pathname = usePathname()

    const toggleSidebar = () => setCollapsed(!collapsed);

    const menuItems = [
        {label: "Dashboard", icon: <FiHome/>, path: "/dashboard"},
        {label: "Entries", icon: <FiBook/>, path: "/entries"},
        {label: "Summary", icon: <FiBarChart2/>, path: "/summary"},
        {label: "Search", icon: <FiSearch/>, path: "/search"},
        {label: "Settings", icon: <FiSettings/>, path: "/settings"},
        {label: "Logout", icon: <FiLogOut/>, path: "/", action: () => signOut()},
    ];

    return (
        <>
            {/* Top Navbar */}
            <nav className="navbar">
                {!session && (
                    <img src="/images/emberlog.png" alt="Emberlog Logo" className="logo"/>
                )}

                <div className="navActions">
                    {session && (
                        <button className="menuButton" onClick={toggleSidebar}>
                            {collapsed ? <FiMenu/> : <FiX/>}
                        </button>
                    )}
                </div>
            </nav>

            {/* Sidebar (only when authenticated) */}
            {session && (
                <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                    <ul>
                        {menuItems.map(({label, icon, path, action}) => (
                            <li key={label} onClick={action ? action : () => router.push(path)}
                                className={pathname === path ? "active" : ""}>
                                {icon} {!collapsed && <span>{label}</span>}
                            </li>
                        ))}
                    </ul>
                </aside>
            )}
        </>
    );
};

export default Navbar;
