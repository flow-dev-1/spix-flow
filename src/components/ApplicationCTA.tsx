import { Button } from "@/components/ui/button";
import { Mail, MapPin, Send, Clock } from "lucide-react";

const APPLICATION_DEADLINE = new Date("2026-02-11T23:59:59");

const ApplicationCTA = () => {
  const now = new Date();
  const isDeadlinePassed = now > APPLICATION_DEADLINE;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to <span className="text-gradient-gold">Apply</span>?
          </h2>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
            Join our growing team of hospitality professionals.
          </p>
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg px-6 py-4 mb-8 max-w-xl mx-auto">
            <p className="text-foreground font-semibold text-lg mb-1">
              📄 Required Documents: <span className="text-gold-dark">CV</span> + <span className="text-gold-dark">Application Letter</span>
            </p>
            <p className="text-destructive text-sm font-medium">
              ⚠️ Incomplete applications will be disqualified.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            {/* Deadline Banner */}
            <div className={`flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-lg ${isDeadlinePassed ? 'bg-destructive/10 text-destructive' : 'bg-gold/10 text-gold-dark'}`}>
              <Clock className="w-5 h-5" />
              <span className="font-semibold">
                {isDeadlinePassed 
                  ? "Application deadline has passed" 
                  : "Application Deadline: Wednesday, 11th February 2026"
                }
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Email your application to</p>
                  <a 
                    href="mailto:alherirecruitment@gmail.com" 
                    className="text-lg font-semibold text-foreground hover:text-gold transition-colors"
                  >
                    alherirecruitment@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-12 bg-border" />
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-cream" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-lg font-semibold text-foreground">
                    Yola, Adamawa State
                  </p>
                </div>
              </div>
            </div>

            <Button 
              size="lg"
              disabled={isDeadlinePassed}
              className="bg-gradient-gold hover:opacity-90 text-secondary font-semibold px-10 py-6 text-lg shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => window.open("mailto:alherirecruitment@gmail.com?subject=Job Application - Alheri Hotel")}
            >
              <Send className="w-5 h-5 mr-2" />
              {isDeadlinePassed ? "Applications Closed" : "Send Your Application"}
            </Button>

            <p className="text-sm text-muted-foreground mt-6">
              📌 Only shortlisted candidates will be contacted.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationCTA;