'use client';

import {ClientSessionWrapper} from "@/components/CleintSessionWrapper";
import Navbar from "@/components/navbar/Navbar";
import AuthForm from "@/components/register/AuthForm";

export default function Home() {
    return (
        <ClientSessionWrapper>
            <Navbar/>
            <AuthForm/>
        </ClientSessionWrapper>
    );
}
