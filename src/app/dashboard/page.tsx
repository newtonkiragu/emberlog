'use client';

import {ClientSessionWrapper} from "@/components/CleintSessionWrapper";
import Navbar from "@/components/navbar/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {LocalizationProvider} from "@mui/x-date-pickers";

export default function DashboardPage() {
    return (
        <ClientSessionWrapper>
            <Navbar/>
            <LocalizationProvider dateAdapter={AdapterDateFns as any}>

                <Dashboard/>
            </LocalizationProvider>

        </ClientSessionWrapper>
    );
}
