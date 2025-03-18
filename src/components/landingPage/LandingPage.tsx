'use client';

import Navbar from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Container, Typography, Box, Grid2, Paper, useTheme } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Image from "next/image"; // Next.js Image for optimized loading
import { Edit, Cloud, Mood, Whatshot, DarkMode, Palette } from "@mui/icons-material";

const features = [
  { icon: <Edit />, text: "Write down your thoughts/happenings each day." },
  { icon: <Cloud />, text: "Cloud syncing across devices." },
  { icon: <Mood />, text: "Mood tracking statistics." },
  { icon: <Whatshot />, text: "Streaks to keep you in the habit of writing." },
  { icon: <DarkMode />, text: "Dark mode, because you deserve it." },
  { icon: <Palette />, text: "App color customization." },
];

const LandingPage = () => {
  const theme = useTheme();

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        {/* Hero Section */}
        <Box textAlign="center" py={5}>
          <Typography variant="h3" fontWeight="bold">
            Welcome to Emberlog
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Your personal journaling app.
          </Typography>
        </Box>

        {/* Swipeable Hero */}
        <SwipeableDrawer open={false} onOpen={() => {}} onClose={() => {}}>
          <Box p={4} textAlign="center">
            <Typography variant="h4">The better way to keep track of your days.</Typography>
            <Typography variant="body1" mt={2} color="text.secondary">
              Emberlog lets you record your daily thoughts and moods beautifully.
              Stay in touch with your personal growth and relive your best memories!
            </Typography>
            <Image src={"/images/hero.svg"} alt="Hero image" width={500} height={300} />
          </Box>
        </SwipeableDrawer>

        {/* Features Section */}
        <Box textAlign="center" mt={5}>
          <Typography variant="h4">Features</Typography>
          <Grid2 container spacing={3} mt={2} justifyContent="center">
            <>
              {features.map(({ icon, text }, index) => (
                <Grid2 item xs={12} sm={6} md={4} key={index}>
                  <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                    <Box fontSize={40} color={theme.palette.primary.main}>
                      {icon}
                    </Box>
                    <Typography variant="body1" mt={1}>
                      {text}
                    </Typography>
                  </Paper>
                </Grid2>
              ))}
            </>
          </Grid2>
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default LandingPage;
