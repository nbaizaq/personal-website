export type ExperienceType = "employment" | "project";
export interface CvExperience {
  id?: string;
  title: string;
  start: Date;
  end?: Date;
  company: string;
  location?: string;
  responsibilities: string[];
  website?: string;
  pageBreak?: boolean;
}

export interface CvEducation {
  start: Date;
  end?: Date;
  university: string;
  location: string;
  degree: string;
  major: string;
  minor?: string;
  gpa?: string;
  courses?: string[];
  academicLeaves?: Array<{
    // Changed to Array type
    start: Date;
    end: Date;
    reasons: Array<{
      // Changed to Array type and made reasons non-optional
      title: string;
      employmentType?: EmploymentType;
      company?: string;
      experienceId?: string; // Add optional experienceId for anchor linking
    }>;
  }>;
}

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship";

export interface CvAward {
  dates: Date[];
  award: string;
  location: string;
}

export interface CvData {
  professionalSummary: string;
  experiences: CvExperience[];
  education: CvEducation;
  awards: CvAward[];
  languages: string[];
  skills: string[];
}

export type Project = {
  github?: string;
  npm?: string;
  name?: string;
  description?: string;
  technologies?: string[];
};
