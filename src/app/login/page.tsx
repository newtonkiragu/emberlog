'use client';

import {Login} from "@/components/login/Login";
import Navbar from "@/components/navbar/Navbar";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default function LoginPage() {
    return (
        <>
            <Navbar/>
            <Breadcrumb/>
            <Login/>
        </>
    );
}
