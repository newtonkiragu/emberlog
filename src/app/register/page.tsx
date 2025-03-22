'use client';

import Navbar from "@/components/navbar/Navbar";
import {AuthForm} from "@/components/register/AuthForm";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default function RegisterPage() {
    return (
        <>
            <Navbar/>
            <Breadcrumb/>
            <AuthForm/>
        </>
    );
}
