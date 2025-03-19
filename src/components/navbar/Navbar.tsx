import {useSession} from "next-auth/react";
import {AppBar, BottomNavigation, BottomNavigationAction, Button, Toolbar, Typography} from "@mui/material";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import MoodIcon from "@mui/icons-material/Mood";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = () => {
    const {data: session} = useSession();
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

    const authenticatedNavItems = [
        {key: "home", label: "Home", icon: <HomeIcon/>, href: "/dashboard"},
        {key: "entries", label: "Entries", icon: <BookIcon/>, href: "/entries"},
        {key: "moods", label: "Moods", icon: <MoodIcon/>, href: "/moods"},
        {key: "search", label: "Search", icon: <SearchIcon/>, href: "/search"},
        {key: "settings", label: "Settings", icon: <SettingsIcon/>, href: "/settings"},
        {key: "logout", label: "Logout", icon: <LogoutIcon/>, href: "/logout"},
    ];

    const guestNavItems = [
        {key: "login", label: "Login", href: "/login"},
        {key: "signup", label: "Sign Up", href: "/register"},
    ];

    return isMobile ? (
        <BottomNavigation showLabels>
            <>
                {(session ? authenticatedNavItems : guestNavItems).map(({key, label, icon, href}) => (
                    <BottomNavigationAction
                        key={key}
                        label={label}
                        icon={icon}
                        component={Link}
                        href={href}
                    />
                ))}
            </>
        </BottomNavigation>
    ) : (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1}}>
                    Emberlog
                </Typography>
                <>
                    {(session ? authenticatedNavItems : guestNavItems).map(({key, label, href}) => (
                        <Button key={key} color="inherit" component={Link} href={href}>
                            {label}
                        </Button>
                    ))}
                </>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
