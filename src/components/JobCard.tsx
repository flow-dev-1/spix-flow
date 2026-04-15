import { Job } from "@/data/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Briefcase, Clock, GraduationCap, Users } from "lucide-react";

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

const JobCard = ({ job, onClick }: JobCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-gold/30 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-3 bg-gold/10 text-gold-dark border-gold/20">
              {job.department}
            </Badge>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-gold-dark transition-colors">
              {job.title}
            </h3>
          </div>
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-lg shadow-gold/20">
            <Briefcase className="w-6 h-6 text-secondary" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
          {job.overview}
        </p>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-gold" />
            <span>{job.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-gold" />
            <span>{job.education}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground col-span-2">
            <Users className="w-4 h-4 text-gold" />
            <span>Reports to: {job.reportsTo}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={onClick}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;