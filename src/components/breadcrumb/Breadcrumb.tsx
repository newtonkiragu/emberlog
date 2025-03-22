"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import './style.css';

const Breadcrumb = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);

    return (
        <nav className="breadcrumb">
            <ul>
                <li>
                    <Link href="/dashboard">Home</Link>
                </li>
                {pathSegments.map((segment, index) => {
                    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                    const label = segment.replace(/-/g, " "); // Convert dashes to spaces

                    return (
                        <li key={href}>
                            <Link href={href}>{label}</Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
