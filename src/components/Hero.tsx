import { Button } from "@/components/ui/button";
import { ChevronDown, Star } from "lucide-react";
import heroImage from "@/assets/hero-hotel.jpg";

const Hero = () => {
  const scrollToJobs = () => {
    document.getElementById("positions")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/60 to-secondary/90" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-4 py-2 mb-8 opacity-0 animate-fade-in">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-gold-light text-sm font-medium">Now Hiring • Deadline: Feb 11, 2026</span>
          </div>
          
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-cream mb-6 opacity-0 animate-fade-in animate-stagger-1">
            Join the{" "}
            <span className="text-gradient-gold">Alheri Hotel</span>{" "}
            Family
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-cream/80 mb-10 max-w-2xl mx-auto opacity-0 animate-fade-in animate-stagger-2">
            A leading hospitality destination in Yola is undergoing a major upgrade. 
            We're seeking experienced professionals to support our vision of service excellence.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in animate-stagger-3">
            <Button 
              onClick={scrollToJobs}
              size="lg" 
              className="bg-gradient-gold hover:opacity-90 text-secondary font-semibold px-8 py-6 text-lg shadow-lg shadow-gold/30 transition-all hover:shadow-xl hover:shadow-gold/40"
            >
              View Open Positions
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-cream/30 text-cream hover:bg-cream/10 px-8 py-6 text-lg backdrop-blur-sm"
              onClick={() => window.open("mailto:alherirecruitment@gmail.com")}
            >
              Apply Now
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-cream/10 max-w-lg mx-auto opacity-0 animate-fade-in animate-stagger-4">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gold">7+</div>
              <div className="text-cream/60 text-sm mt-1">Positions</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gold">1</div>
              <div className="text-cream/60 text-sm mt-1">Location</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gold">∞</div>
              <div className="text-cream/60 text-sm mt-1">Possibilities</div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cream/50" />
        </div>
      </div>
    </section>
  );
};

export default Hero;