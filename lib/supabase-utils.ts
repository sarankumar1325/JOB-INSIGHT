import { JobStatus } from "./constants";
import { processAndCleanJobDescription } from "./job-process";
import { genAI } from "./gemini-ai";
import { getJobTitleDescPrompt } from "./prompt";

/**
 * Creates a new job analysis
 */
export async function createJob(userId: string, jobDescription: string) {
  try {
    // Demo implementation - in a real app, this would save to Supabase
    // Process description using Gemini AI
    const processedDesc = await processAndCleanJobDescription(jobDescription);
    
    let title = "Untitled";
    let htmlDescription = "";
    
    try {
      const prompt = getJobTitleDescPrompt(processedDesc);
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          maxOutputTokens: 2000,
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      });
      
      if (response.text) {
        const parsedResponse = JSON.parse(response.text);
        title = parsedResponse.title;
        htmlDescription = parsedResponse.htmlDescription;
      }
    } catch (error) {
      console.error("AI processing failed", error);
    }
    
    // Generate a random ID for demo purposes
    const jobId = `job_${Math.random().toString(36).substring(2, 15)}`;
    
    // Save job details (in a real app, this would use Supabase client)
    const job = {
      id: jobId,
      userId,
      jobTitle: title,
      originalDescription: jobDescription,
      processedDescription: processedDesc,
      htmlFormatDescription: htmlDescription,
      status: JobStatus.READY,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    // For demo, store in localStorage
    if (typeof window !== 'undefined') {
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      jobs.push(job);
      localStorage.setItem('jobs', JSON.stringify(jobs));
    }
    
    return { data: jobId, success: true };
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

/**
 * Retrieves a job by ID from localStorage or database
 */
export function getJobById(jobId: string) {
  if (typeof window === 'undefined') return null;
  
  try {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const job = jobs.find((j: any) => j.id === jobId);
    
    if (job) {
      return {
        id: job.id,
        title: job.jobTitle || 'Untitled',
        description: job.originalDescription || '',
        company: null, // We don't store company info in our demo
        processed_description: job.htmlFormatDescription || job.processedDescription || '',
        status: job.status,
        // Include original fields for compatibility
        jobTitle: job.jobTitle,
        originalDescription: job.originalDescription,
        processedDescription: job.processedDescription,
        htmlFormatDescription: job.htmlFormatDescription
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
}

/**
 * Gets all jobs for a user from localStorage
 */
export async function getAllJobs(userId: string) {
  if (typeof window === 'undefined') return [];
  
  try {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    return jobs.filter((job: any) => job.userId === userId);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
} 