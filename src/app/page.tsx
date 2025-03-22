'use client';

import Landing from "@/components/landingPage/Landing";
import Navbar from "@/components/navbar/Navbar";
import {Footer} from "@/components/footer/Footer";

export default function Home() {
    return (
        <>
            <Navbar/>
            <Landing/>
            <Footer/>
        </>
    );
}
