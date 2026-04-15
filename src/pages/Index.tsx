import Header from "@/components/Header";
import Hero from "@/components/Hero";
import JobListings from "@/components/JobListings";
import WhyJoinUs from "@/components/WhyJoinUs";
import ApplicationCTA from "@/components/ApplicationCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="spix-page min-h-screen">
      <Header />
      <Hero />
      <JobListings />
      <WhyJoinUs />
      <ApplicationCTA />
      <Footer />
    </div>
  );
};

export default Index;
