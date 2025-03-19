'use client';

import {ClientSessionWrapper} from "@/components/CleintSessionWrapper";
import Navbar from "@/components/navbar/Navbar";
import Entry from "@/components/entry/WriteEntry";

export default function WriteEntry() {
    return (
        <ClientSessionWrapper>
            <Navbar/>
            <Entry/>
        </ClientSessionWrapper>
    );
}
