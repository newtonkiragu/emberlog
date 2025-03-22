'use client';

import Navbar from "@/components/navbar/Navbar";
import Entry from "@/components/entry/WriteEntry";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default function WriteEntryPage() {
    return (
        <>
            <Navbar/>
            <Breadcrumb/>
            <Entry/>
        </>
    );
}
