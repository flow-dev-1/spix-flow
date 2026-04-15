import { Heart, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-serif font-bold text-cream mb-2">
              Alheri Hotel
            </h3>
            <p className="text-secondary-foreground/60 text-sm">
              A leading hospitality destination in Yola
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-2 text-secondary-foreground/70">
              <MapPin className="w-4 h-4 text-gold" />
              <span className="text-sm">Yola, Adamawa State, Nigeria</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-foreground/70">
              <Mail className="w-4 h-4 text-gold" />
              <a 
                href="mailto:alherirecruitment@gmail.com" 
                className="text-sm hover:text-gold transition-colors"
              >
                alherirecruitment@gmail.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-cream/10 mt-8 pt-8 text-center">
          <p className="text-secondary-foreground/50 text-sm flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-gold fill-gold" /> for Alheri Hotel Careers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;