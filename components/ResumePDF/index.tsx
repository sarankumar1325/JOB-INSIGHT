"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Loader, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getJobById } from '@/lib/supabase-utils';
import { useTheme } from 'next-themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { genAI } from '@/lib/gemini-ai';

interface ResumeData {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: string[];
  experience?: {
    title: string;
    company: string;
    date: string;
    description: string;
  }[];
  education?: {
    degree: string;
    institution: string;
    date: string;
  }[];
}

interface ResumePDFProps {
  jobId: string;
  className?: string;
}

const ResumePDF: React.FC<ResumePDFProps> = ({ 
  jobId,
  className = "" 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobTitle, setJobTitle] = useState<string>("Software Engineer");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("preview");
  const resumeRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      try {
        if (!jobId) return;
        
        // Get job details using the jobId
        const jobData = getJobById(jobId);
        
        if (jobData) {
          setJobTitle(jobData.jobTitle || jobData.title || "Software Engineer");
          setJobDescription(jobData.processedDescription || jobData.processed_description || jobData.originalDescription || jobData.description || "");
          // Generate the resume once we have job data
          generateResume(jobData);
        } else {
          console.error("Job not found");
          setError("Job not found");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Error fetching job details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);
  
  const generateResume = async (jobData = null) => {
    setIsGenerating(true);
    try {
      // Get job data if not passed in
      const currentJob = jobData || getJobById(jobId);
      if (!currentJob) {
        setError("No job data available");
        return;
      }

      // Handle different property naming in the job object
      const description = currentJob.processedDescription || 
                         currentJob.processed_description || 
                         currentJob.originalDescription || 
                         currentJob.description || "";
      
      if (!description) {
        setError("No job description available");
        return;
      }

      const title = currentJob.jobTitle || currentJob.title || "Untitled Position";
      setJobTitle(title);

      // Use Gemini AI to generate the resume content
      const prompt = `Create a tailored resume for a ${title} position based on this job description: ${description}. 
      Format as JSON with these sections: 
      {
        "fullName": "Candidate Name",
        "title": "${title}",
        "email": "email@example.com", 
        "phone": "+1 (555) 123-4567", 
        "location": "City, State",
        "summary": "Professional summary tailored to this job",
        "skills": ["Skill 1", "Skill 2", "Skill 3", ...],
        "experience": [
          { 
            "title": "Job Title", 
            "company": "Company Name", 
            "date": "Month Year - Month Year", 
            "description": "Job responsibilities and achievements"
          }
        ],
        "education": [
          {
            "degree": "Degree Name",
            "institution": "Institution Name",
            "date": "Year - Year"
          }
        ]
      }`;

      try {
        const response = await genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            maxOutputTokens: 2000,
            temperature: 0.3,
          },
        });
        
        if (response.text) {
          try {
            // Clean the response text - remove markdown code blocks if present
            let cleanText = response.text;
            
            // Remove markdown code block indicators if present
            cleanText = cleanText.replace(/```json\s*/g, '');
            cleanText = cleanText.replace(/```\s*$/g, '');
            cleanText = cleanText.trim();
            
            // Now parse the cleaned JSON
            const jsonData = JSON.parse(cleanText);
            setResumeData(jsonData);
            setError(null);
          } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            setError("Failed to generate properly formatted resume");
          }
        } else {
          setError("No response from AI");
        }
      } catch (aiError) {
        console.error("AI generation error:", aiError);
        setError("Failed to generate resume content");
      }
    } catch (error) {
      console.error("Error in generate resume:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper function to extract skills from job description
  const extractSkillsFromDescription = (description: string): string[] => {
    // Common tech skills to extract - in a real app, this would be more sophisticated
    const commonSkills = [
      "JavaScript", "TypeScript", "React", "Node.js", "Express", 
      "MongoDB", "SQL", "Git", "Docker", "AWS", "Python", "Java",
      "HTML", "CSS", "Tailwind", "MERN", "Angular", "Vue", "Next.js",
      "REST API", "GraphQL", "CI/CD", "Agile", "Scrum", "DevOps"
    ];
    
    // Filter skills that appear in the description
    return commonSkills.filter(skill => 
      description.toLowerCase().includes(skill.toLowerCase())
    ).slice(0, 12); // Limit to 12 skills
  };
  
  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    
    try {
      // Store original styles that need to be reverted
      const originalStyles = {
        maxHeight: resumeRef.current.style.maxHeight,
        height: resumeRef.current.style.height,
        overflow: resumeRef.current.style.overflow,
        position: resumeRef.current.style.position
      };
      
      // Temporarily modify the element for better PDF rendering
      resumeRef.current.style.maxHeight = 'none';
      resumeRef.current.style.height = 'auto';
      resumeRef.current.style.overflow = 'visible';
      resumeRef.current.style.position = 'absolute';
      resumeRef.current.style.top = '0';
      resumeRef.current.style.left = '0';
      resumeRef.current.style.zIndex = '-9999';
      
      // Create a canvas from the entire resumeRef content
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2, // Increase scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
        // Ensure we capture the full height and width
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight * 4, // Ensure enough height
        height: resumeRef.current.scrollHeight,
        width: resumeRef.current.scrollWidth,
        // Important: the below options help ensure the entire content is captured
        onclone: (clonedDoc, element) => {
          const clonedElement = clonedDoc.querySelector('[data-html2canvas-clone="true"]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.height = 'auto';
            clonedElement.style.overflow = 'visible';
            clonedElement.style.width = `${resumeRef.current?.scrollWidth}px`;
            
            // Remove any fixed height containers within the cloned element
            const containers = clonedElement.querySelectorAll('[style*="height"]');
            containers.forEach((container: any) => {
              if (container.style.height.includes('vh') || container.style.maxHeight.includes('vh')) {
                container.style.height = 'auto';
                container.style.maxHeight = 'none';
                container.style.overflow = 'visible';
              }
            });
          }
        }
      });
      
      // Restore the original styles
      resumeRef.current.style.maxHeight = originalStyles.maxHeight;
      resumeRef.current.style.height = originalStyles.height;
      resumeRef.current.style.overflow = originalStyles.overflow;
      resumeRef.current.style.position = originalStyles.position;
      resumeRef.current.style.top = '';
      resumeRef.current.style.left = '';
      resumeRef.current.style.zIndex = '';
      
      // Generate PDF from canvas
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate the ratio to fit the image to the page width
      const ratio = pageWidth / imgWidth;
      const totalPages = Math.ceil(imgHeight * ratio / pageHeight);
      
      // Add each portion of the image as a separate page
      for (let i = 0; i < totalPages; i++) {
        // Add a new page after the first page
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate position and height for the current page slice
        const srcY = i * pageHeight / ratio;
        const sliceHeight = Math.min(pageHeight / ratio, imgHeight - srcY);
        
        pdf.addImage(
          imgData, 
          'PNG', 
          0, // x position
          0, // y position
          pageWidth, // target width
          sliceHeight * ratio, // target height
          '', // alias
          'FAST', // compression
          0, // rotation
          srcY // source Y (vertical) offset for slicing
        );
      }
      
      pdf.save(`resume-${jobTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col space-y-4 ${className}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-base font-medium text-foreground">Resume Generator</h3>
        </div>
        
        {!resumeData ? (
          <Button 
            onClick={generateResume}
            variant="outline"
            size="sm"
            className="text-xs group hover:bg-primary hover:text-primary-foreground transition-colors"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader className="w-3 h-3 mr-1.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 mr-1.5 group-hover:scale-110 transition-transform" />
                <span>Generate Resume</span>
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={downloadPDF} 
            variant="outline"
            size="sm"
            className="text-xs group hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Download className="w-3 h-3 mr-1.5 group-hover:scale-110 transition-transform" />
            <span>Download</span>
          </Button>
        )}
      </div>
      
      {resumeData ? (
        <Tabs 
          defaultValue="preview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-2 w-full">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="text">Text Only</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-0">
            <div 
              ref={resumeRef} 
              className="p-6 border border-border bg-card text-card-foreground rounded-lg shadow-sm h-[60vh] overflow-y-auto custom-scrollbar"
            >
              <header className="border-b border-border pb-4 mb-4">
                <h1 className="text-xl font-bold mb-1 text-foreground">{resumeData.fullName}</h1>
                <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <span>{resumeData.email}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{resumeData.phone}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{resumeData.location}</span>
                </div>
              </header>
              
              <section className="mb-4">
                <h2 className="text-base font-semibold text-foreground mb-2 border-b border-border pb-1">Summary</h2>
                <p className="text-sm text-muted-foreground">{resumeData.summary}</p>
              </section>
              
              <section className="mb-4">
                <h2 className="text-base font-semibold text-foreground mb-2 border-b border-border pb-1">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills?.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
              
              <section className="mb-4">
                <h2 className="text-base font-semibold text-foreground mb-2 border-b border-border pb-1">Experience</h2>
                {resumeData.experience?.map((exp, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                      <h3 className="font-medium text-foreground">{exp.title}</h3>
                      <span className="text-xs text-muted-foreground">{exp.date}</span>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium mb-1">{exp.company}</div>
                    <p className="text-xs text-muted-foreground">{exp.description}</p>
                  </div>
                ))}
              </section>
              
              <section>
                <h2 className="text-base font-semibold text-foreground mb-2 border-b border-border pb-1">Education</h2>
                {resumeData.education?.map((edu, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                      <h3 className="font-medium text-foreground">{edu.degree}</h3>
                      <span className="text-xs text-muted-foreground">{edu.date}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{edu.institution}</div>
                  </div>
                ))}
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="mt-0">
            <div className="p-4 border border-border bg-card text-card-foreground text-sm h-[60vh] overflow-y-auto custom-scrollbar rounded-lg">
              <h1 className="text-lg font-bold mb-1 text-foreground">{resumeData.fullName}</h1>
              <div className="text-muted-foreground mb-3 text-xs">
                {resumeData.email} • {resumeData.phone} • {resumeData.location}
              </div>
              
              <h2 className="text-base font-semibold mt-4 mb-1 text-foreground">Summary</h2>
              <p className="text-sm text-muted-foreground">{resumeData.summary}</p>
              
              <h2 className="text-base font-semibold mt-4 mb-2 text-foreground">Skills</h2>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {resumeData.skills?.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
              
              <h2 className="text-base font-semibold mt-4 mb-2 text-foreground">Experience</h2>
              {resumeData.experience?.map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <h3 className="font-medium text-foreground">{exp.title}</h3>
                    <span className="text-xs text-muted-foreground">{exp.date}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">{exp.company}</div>
                  <p className="text-xs text-muted-foreground">{exp.description}</p>
                </div>
              ))}
              
              <h2 className="text-base font-semibold mt-4 mb-2 text-foreground">Education</h2>
              {resumeData.education?.map((edu, i) => (
                <div key={i} className="mb-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <h3 className="font-medium text-foreground">{edu.degree}</h3>
                    <span className="text-xs text-muted-foreground">{edu.date}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{edu.institution}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="min-h-[250px] flex flex-col items-center justify-center p-4 border border-dashed border-border rounded-lg text-center space-y-3 bg-card/50">
          <FileText className="w-10 h-10 text-muted-foreground opacity-40" />
          <div>
            <p className="text-muted-foreground text-sm">Generate a tailored resume for this job</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Our AI will create a targeted resume based on this posting</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResumePDF; 