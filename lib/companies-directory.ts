/**
 * Directory of premier Indian and Global Tech Companies, AI Labs, and Startups.
 * If a user's company is not listed, custom write-in is supported.
 */

export interface CompanyEntry {
  name: string;
  category: "Global Tech Giant" | "Indian Unicorn / Tech" | "AI Research Lab" | "Startup / Boutique" | "Other";
  headquarters: string;
}

export const COMPANIES_DIRECTORY: CompanyEntry[] = [
  // ── Global Tech Giants ──
  { name: "Google / Alphabet", category: "Global Tech Giant", headquarters: "Mountain View, CA / India Hubs" },
  { name: "Microsoft", category: "Global Tech Giant", headquarters: "Redmond, WA / India Hubs" },
  { name: "Amazon / AWS", category: "Global Tech Giant", headquarters: "Seattle, WA / India Hubs" },
  { name: "Meta (Facebook / Instagram)", category: "Global Tech Giant", headquarters: "Menlo Park, CA" },
  { name: "Apple", category: "Global Tech Giant", headquarters: "Cupertino, CA / Bengaluru" },
  { name: "NVIDIA", category: "Global Tech Giant", headquarters: "Santa Clara, CA / Pune / Bengaluru" },
  { name: "Oracle", category: "Global Tech Giant", headquarters: "Austin, TX / Hyderabad / Bengaluru" },
  { name: "Salesforce", category: "Global Tech Giant", headquarters: "San Francisco, CA / Hyderabad" },
  { name: "Adobe", category: "Global Tech Giant", headquarters: "San Jose, CA / Noida / Bengaluru" },
  { name: "Uber", category: "Global Tech Giant", headquarters: "San Francisco, CA / Bengaluru / Hyderabad" },
  { name: "Cisco Systems", category: "Global Tech Giant", headquarters: "San Jose, CA / Bengaluru" },
  { name: "IBM", category: "Global Tech Giant", headquarters: "Armonk, NY / India" },

  // ── Frontier AI Labs & High Growth AI Companies ──
  { name: "OpenAI", category: "AI Research Lab", headquarters: "San Francisco, CA" },
  { name: "Anthropic", category: "AI Research Lab", headquarters: "San Francisco, CA" },
  { name: "Perplexity AI", category: "AI Research Lab", headquarters: "San Francisco, CA" },
  { name: "Mistral AI", category: "AI Research Lab", headquarters: "Paris, France" },
  { name: "Hugging Face", category: "AI Research Lab", headquarters: "New York / Paris" },
  { name: "Cohere", category: "AI Research Lab", headquarters: "Toronto, Canada" },
  { name: "Scale AI", category: "AI Research Lab", headquarters: "San Francisco, CA" },
  { name: "Together AI", category: "AI Research Lab", headquarters: "San Francisco, CA" },
  { name: "Groq", category: "AI Research Lab", headquarters: "Mountain View, CA" },
  { name: "LangChain", category: "AI Research Lab", headquarters: "San Francisco, CA" },

  // ── Top Indian Tech Unicorns & Product Companies ──
  { name: "Razorpay", category: "Indian Unicorn / Tech", headquarters: "Bengaluru, India" },
  { name: "Postman", category: "Indian Unicorn / Tech", headquarters: "Bengaluru / San Francisco" },
  { name: "CRED", category: "Indian Unicorn / Tech", headquarters: "Bengaluru, India" },
  { name: "Swiggy", category: "Indian Unicorn / Tech", headquarters: "Bengaluru, India" },
  { name: "Zomato / Blinkit", category: "Indian Unicorn / Tech", headquarters: "Gurugram, India" },
  { name: "Flipkart", category: "Indian Unicorn / Tech", headquarters: "Bengaluru, India" },
  { name: "Groww", category: "Indian Unicorn / Tech", headquarters: "Bengaluru, India" },
  { name: "Zerodha", category: "Indian Unicorn / Tech", headquarters: "Bengaluru, India" },
  { name: "PhonePe", category: "Indian Unicorn / Tech", headquarters: "Bengaluru, India" },
  { name: "BrowserStack", category: "Indian Unicorn / Tech", headquarters: "Mumbai / Dublin" },
  { name: "Hasura", category: "Indian Unicorn / Tech", headquarters: "Bengaluru / San Francisco" },
  { name: "Freshworks", category: "Indian Unicorn / Tech", headquarters: "Chennai / San Mateo" },
  { name: "Zoho Corporation", category: "Indian Unicorn / Tech", headquarters: "Chennai, India" },
  { name: "Ola / Ola Electric", category: "Indian Unicorn / Tech", headquarters: "Bengaluru, India" },
  { name: "Jio Platforms", category: "Indian Unicorn / Tech", headquarters: "Mumbai, India" },
  { name: "Info Edge (Naukri / 99acres)", category: "Indian Unicorn / Tech", headquarters: "Noida, India" },

  // ── Major Enterprise IT & Global Consulting ──
  { name: "Tata Consultancy Services (TCS)", category: "Indian Unicorn / Tech", headquarters: "Mumbai, India" },
  { name: "Infosys", category: "Indian Unicorn / Tech", headquarters: "Bengaluru, India" },
  { name: "Wipro", category: "Indian Unicorn / Tech", headquarters: "Bengaluru, India" },
  { name: "HCLTech", category: "Indian Unicorn / Tech", headquarters: "Noida, India" },
  { name: "LTIMindtree", category: "Indian Unicorn / Tech", headquarters: "Mumbai, India" },
  { name: "Tech Mahindra", category: "Indian Unicorn / Tech", headquarters: "Pune, India" },
  { name: "Accenture", category: "Global Tech Giant", headquarters: "Dublin / India Hubs" },
  { name: "Cognizant", category: "Global Tech Giant", headquarters: "Teaneck, NJ / Chennai" },
  { name: "Capgemini", category: "Global Tech Giant", headquarters: "Paris / India Hubs" },
  { name: "Deloitte Digital", category: "Global Tech Giant", headquarters: "London / Hyderabad" },

  // ── Early Stage & Stealth / Freelance ──
  { name: "Botmartz / AI Hub", category: "Startup / Boutique", headquarters: "Indore / Remote" },
  { name: "Y Combinator Funded Startup", category: "Startup / Boutique", headquarters: "San Francisco / Remote" },
  { name: "Early Stage Stealth AI Startup", category: "Startup / Boutique", headquarters: "Remote Worldwide" },
  { name: "Independent Freelance AI Consultant", category: "Other", headquarters: "Global Remote" }
];
