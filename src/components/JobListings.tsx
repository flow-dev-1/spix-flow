import { useState } from "react";
import { jobs, departments, Job } from "@/data/jobs";
import JobCard from "./JobCard";
import JobModal from "./JobModal";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const JobListings = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = activeFilter === "All" || job.department === activeFilter;
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.overview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="positions" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Available <span className="text-gradient-gold">Positions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preference will be given to candidates currently working in a hotel or hospitality environment. 
            Only shortlisted candidates will be contacted.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search positions..." 
              className="pl-10 bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Department Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("All")}
              className={activeFilter === "All" 
                ? "bg-gradient-gold text-secondary" 
                : "border-border hover:border-gold/50 hover:text-gold-dark"
              }
            >
              All ({jobs.length})
            </Button>
            {departments.map(dept => (
              <Button
                key={dept}
                variant={activeFilter === dept ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(dept)}
                className={activeFilter === dept 
                  ? "bg-gradient-gold text-secondary" 
                  : "border-border hover:border-gold/50 hover:text-gold-dark"
                }
              >
                {dept}
              </Button>
            ))}
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <div 
              key={job.id} 
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <JobCard 
                job={job} 
                onClick={() => setSelectedJob(job)}
              />
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No positions found matching your criteria.</p>
          </div>
        )}

        {/* Job Modal */}
        <JobModal 
          job={selectedJob}
          open={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      </div>
    </section>
  );
};

export default JobListings;