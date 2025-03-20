'use client';

import {ClientSessionWrapper} from "@/components/CleintSessionWrapper";
import Navbar from "@/components/navbar/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import {Footer} from "@/components/footer/Footer";

export default function DashboardPage() {
    return (
        <ClientSessionWrapper>
            <Navbar/>
            <Dashboard/>
            <Footer/>
        </ClientSessionWrapper>
    );
}
