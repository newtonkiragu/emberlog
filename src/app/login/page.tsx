'use client';

import {ClientSessionWrapper} from "@/components/CleintSessionWrapper";
import Login from "@/components/login/Login";
import Navbar from "@/components/navbar/Navbar";

export default function Login() {
    return (
        <ClientSessionWrapper>
            <Navbar/>
            <Login/>
        </ClientSessionWrapper>
    );
}
git