'use client';

import Navbar from "@/components/navbar/Navbar";
import Settings from "@/components/settings/Settings";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default function SettingsPage() {
    return (
        <>
            <Navbar/>
            <Breadcrumb/>
            <Settings/>
        </>
    );
}
