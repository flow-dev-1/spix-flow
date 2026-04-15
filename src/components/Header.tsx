import { MapPin, Mail } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 text-sm">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <MapPin className="w-4 h-4 text-gold" />
            <span>Yola, Adamawa State, Nigeria</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gold" />
            <a href="mailto:alherirecruitment@gmail.com" className="hover:text-gold transition-colors">
              alherirecruitment@gmail.com
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;