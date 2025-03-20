import './style.css';

export const Footer = () => (
    <footer className="footer">
        <p>
            &copy; {new Date().getFullYear()} Emberlog. All Rights Reserved. Built with ❤️!
        </p>
    </footer>
);
