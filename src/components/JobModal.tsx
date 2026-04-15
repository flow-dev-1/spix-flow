import { Job } from "@/data/jobs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Mail, 
  MapPin, 
  Star, 
  Users,
  DollarSign 
} from "lucide-react";

interface JobModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

const APPLICATION_DEADLINE = new Date("2026-02-11T23:59:59");

const JobModal = ({ job, open, onClose }: JobModalProps) => {
  const now = new Date();
  const isDeadlinePassed = now > APPLICATION_DEADLINE;

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-hero p-6 text-cream">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-secondary" />
              </div>
              <div className="flex-1">
                <Badge className="mb-2 bg-gold/20 text-gold-light border-gold/30">
                  {job.department}
                </Badge>
                <DialogTitle className="text-2xl font-bold text-cream">
                  {job.title}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
          
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-cream/20">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              <span className="text-sm">Yola, Nigeria</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" />
              <span className="text-sm">{job.reportsTo}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              <span className="text-sm">{job.experience}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gold" />
              <span className="text-sm">{job.salary}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <ScrollArea className="flex-1 max-h-[50vh]">
          <div className="p-6 space-y-6">
            {/* Overview */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-gold" />
                Role Overview
              </h4>
              <p className="text-muted-foreground leading-relaxed">{job.overview}</p>
            </div>
            
            <Separator />
            
            {/* Responsibilities */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gold" />
                Key Responsibilities
              </h4>
              <ul className="space-y-2">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            {/* Requirements */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gold" />
                Requirements
              </h4>
              <ul className="space-y-2">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            {/* Competencies */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Core Competencies</h4>
              <div className="flex flex-wrap gap-2">
                {job.competencies.map((competency, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="bg-muted/50 border-border text-muted-foreground"
                  >
                    {competency}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        {/* Footer */}
        <div className="p-6 pt-4 border-t bg-muted/30">
          <Button 
            disabled={isDeadlinePassed}
            className="w-full bg-gradient-gold hover:opacity-90 text-secondary font-semibold py-6 text-lg shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => window.open("mailto:alherirecruitment@gmail.com?subject=Application for " + job.title)}
          >
            <Mail className="w-5 h-5 mr-2" />
            {isDeadlinePassed ? "Applications Closed" : "Apply for this Position"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobModal;