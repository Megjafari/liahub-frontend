export interface Job {
  id: string
  externalId: string
  title: string
  employer: string
  city: string | null
  techTags: string[]
  studentSignals: string[]
  negativeSignals: string[]
  relevanceScore: number
  url: string
  fetchedAt: string
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  locationMatched: boolean
  workMode: string | null
}

export interface User {
  id: string
  email: string
  name: string
  city: string | null
  school: string | null
  liaPeriod: string | null
  createdAt: string
  techStacks: string[]
}

export interface UserTechStack {
  id: string
  userId: string
  tech: string
}

export interface SavedJob {
  id: string
  userId: string
  externalJobId: string
  jobTitle: string
  employer: string
  url: string
  savedAt: string
}

export interface Application {
  id: string
  userId: string
  externalJobId: string
  jobTitle: string
  employer: string
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  appliedAt: string
  status: 'Sökt' | 'Intervju' | 'Avslag' | 'Erbjudande'
}