'use client';

import {ClientSessionWrapper} from "@/components/CleintSessionWrapper";
import Navbar from "@/components/navbar/Navbar";
import Settings from "@/components/settings/Settings";

export default function SettingsPage() {
    return (
        <ClientSessionWrapper>
            <Navbar/>
            <Settings/>
        </ClientSessionWrapper>
    );
}
