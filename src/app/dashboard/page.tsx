'use client';

import Navbar from "@/components/navbar/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import {Footer} from "@/components/footer/Footer";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default function DashboardPage() {
    return (
        <>
            <Navbar/>
            <Breadcrumb/>
            <Dashboard/>
            <Footer/>
        </>
    );
}
