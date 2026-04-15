import { Award, Heart, TrendingUp, Users } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Be part of our major upgrade and operational upscale with real opportunities for advancement."
  },
  {
    icon: Heart,
    title: "Hospitality Excellence",
    description: "Join a team committed to world-class service and guest satisfaction."
  },
  {
    icon: Award,
    title: "Competitive Package",
    description: "Enjoy competitive remuneration commensurate with your experience and skills."
  },
  {
    icon: Users,
    title: "Team Environment",
    description: "Work alongside experienced hospitality professionals in a collaborative setting."
  }
];

const WhyJoinUs = () => {
  return (
    <section className="py-20 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Join <span className="text-gradient-gold">Alheri Hotel</span>?
          </h2>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">
            We're more than just a hotel – we're a family committed to excellence in hospitality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.title}
              className="bg-navy-light/50 backdrop-blur-sm rounded-2xl p-6 border border-cream/10 hover:border-gold/30 transition-all duration-300 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-cream mb-2">{benefit.title}</h3>
              <p className="text-secondary-foreground/70 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoinUs;