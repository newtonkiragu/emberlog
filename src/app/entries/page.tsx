'use client';

import Navbar from "@/components/navbar/Navbar";
import {Footer} from "@/components/footer/Footer";
import ListEntries from "@/components/entry/ListEntries";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default function EntriesPage() {
    return (
        <>
            <Navbar/>
            <Breadcrumb/>
            <ListEntries/>
            <Footer/>
        </>
    );
}
