/**
 * Directory of premier Indian and Global Universities & Institutes.
 * If a user's institute is not listed, custom write-in is supported.
 */

export interface UniversityEntry {
  name: string;
  country: string;
  city?: string;
  category: "India Premier" | "India State / Private" | "Global Top Tech" | "Other";
}

export const UNIVERSITIES_DIRECTORY: UniversityEntry[] = [
  // ── Indian Premier Institutes (IITs, NITs, IIITs, BITS, Central) ──
  { name: "IIT Bombay (Indian Institute of Technology Bombay)", country: "India", city: "Mumbai", category: "India Premier" },
  { name: "IIT Delhi (Indian Institute of Technology Delhi)", country: "India", city: "New Delhi", category: "India Premier" },
  { name: "IIT Madras (Indian Institute of Technology Madras)", country: "India", city: "Chennai", category: "India Premier" },
  { name: "IIT Kanpur (Indian Institute of Technology Kanpur)", country: "India", city: "Kanpur", category: "India Premier" },
  { name: "IIT Kharagpur (Indian Institute of Technology Kharagpur)", country: "India", city: "Kharagpur", category: "India Premier" },
  { name: "IIT Roorkee (Indian Institute of Technology Roorkee)", country: "India", city: "Roorkee", category: "India Premier" },
  { name: "IIT Guwahati (Indian Institute of Technology Guwahati)", country: "India", city: "Guwahati", category: "India Premier" },
  { name: "IIT Indore (Indian Institute of Technology Indore)", country: "India", city: "Indore", category: "India Premier" },
  { name: "IIT Hyderabad (Indian Institute of Technology Hyderabad)", country: "India", city: "Hyderabad", category: "India Premier" },
  { name: "IIT Varanasi (BHU)", country: "India", city: "Varanasi", category: "India Premier" },
  { name: "BITS Pilani (Pilani, Goa, Hyderabad)", country: "India", city: "Pilani", category: "India Premier" },
  { name: "IIIT Hyderabad (International Institute of Information Technology)", country: "India", city: "Hyderabad", category: "India Premier" },
  { name: "IIIT Bangalore", country: "India", city: "Bengaluru", category: "India Premier" },
  { name: "IIIT Delhi (Indraprastha Institute of Information Technology)", country: "India", city: "New Delhi", category: "India Premier" },
  { name: "NIT Trichy (National Institute of Technology Tiruchirappalli)", country: "India", city: "Tiruchirappalli", category: "India Premier" },
  { name: "NIT Surathkal (NIT Karnataka)", country: "India", city: "Surathkal", category: "India Premier" },
  { name: "NIT Warangal", country: "India", city: "Warangal", category: "India Premier" },
  { name: "NIT Rourkela", country: "India", city: "Rourkela", category: "India Premier" },
  { name: "NIT Calicut", country: "India", city: "Calicut", category: "India Premier" },
  { name: "MANIT Bhopal (Maulana Azad National Institute of Technology)", country: "India", city: "Bhopal", category: "India Premier" },
  { name: "VNIT Nagpur", country: "India", city: "Nagpur", category: "India Premier" },
  { name: "MNIT Jaipur", country: "India", city: "Jaipur", category: "India Premier" },
  { name: "DTU (Delhi Technological University)", country: "India", city: "New Delhi", category: "India Premier" },
  { name: "NSUT (Netaji Subhas University of Technology)", country: "India", city: "New Delhi", category: "India Premier" },
  { name: "IISc Bangalore (Indian Institute of Science)", country: "India", city: "Bengaluru", category: "India Premier" },
  { name: "ISI Kolkata (Indian Statistical Institute)", country: "India", city: "Kolkata", category: "India Premier" },
  { name: "CMI (Chennai Mathematical Institute)", country: "India", city: "Chennai", category: "India Premier" },

  // ── Madhya Pradesh & Regional Tech Hub Colleges ──
  { name: "SGSITS Indore (Shri Govindram Seksaria Institute of Technology and Science)", country: "India", city: "Indore", category: "India State / Private" },
  { name: "IET DAVV Indore (Institute of Engineering and Technology, Devi Ahilya Vishwavidyalaya)", country: "India", city: "Indore", category: "India State / Private" },
  { name: "Medi-Caps University Indore", country: "India", city: "Indore", category: "India State / Private" },
  { name: "SVVV Indore (Shri Vaishnav Vidyapeeth Vishwavidyalaya)", country: "India", city: "Indore", category: "India State / Private" },
  { name: "Acropolis Institute of Technology and Research, Indore", country: "India", city: "Indore", category: "India State / Private" },
  { name: "IPS Academy, Institute of Engineering & Science, Indore", country: "India", city: "Indore", category: "India State / Private" },
  { name: "NMIMS Indore", country: "India", city: "Indore", category: "India State / Private" },
  { name: "Symbiosis University of Applied Sciences, Indore", country: "India", city: "Indore", category: "India State / Private" },
  { name: "Oriental Institute of Science and Technology, Bhopal", country: "India", city: "Bhopal", category: "India State / Private" },
  { name: "LNCT Bhopal (Lakshmi Narain College of Technology)", country: "India", city: "Bhopal", category: "India State / Private" },
  { name: "JEC Jabalpur (Jabalpur Engineering College)", country: "India", city: "Jabalpur", category: "India State / Private" },
  { name: "MITS Gwalior (Madhav Institute of Technology & Science)", country: "India", city: "Gwalior", category: "India State / Private" },

  // ── Pan-India Major Tech & Private Universities ──
  { name: "VIT Vellore (Vellore Institute of Technology)", country: "India", city: "Vellore", category: "India State / Private" },
  { name: "VIT Chennai / VIT Bhopal / VIT AP", country: "India", city: "Vellore", category: "India State / Private" },
  { name: "Manipal Institute of Technology (MAHE)", country: "India", city: "Manipal", category: "India State / Private" },
  { name: "SRM Institute of Science and Technology, Chennai", country: "India", city: "Chennai", category: "India State / Private" },
  { name: "Thapar Institute of Engineering and Technology, Patiala", country: "India", city: "Patiala", category: "India State / Private" },
  { name: "PSG College of Technology, Coimbatore", country: "India", city: "Coimbatore", category: "India State / Private" },
  { name: "COEP Technological University, Pune", country: "India", city: "Pune", category: "India State / Private" },
  { name: "VJTI Mumbai (Veermata Jijabai Technological Institute)", country: "India", city: "Mumbai", category: "India State / Private" },
  { name: "RV College of Engineering (RVCE), Bengaluru", country: "India", city: "Bengaluru", category: "India State / Private" },
  { name: "BMS College of Engineering (BMSCE), Bengaluru", country: "India", city: "Bengaluru", category: "India State / Private" },
  { name: "PES University, Bengaluru", country: "India", city: "Bengaluru", category: "India State / Private" },
  { name: "MS Ramaiah Institute of Technology (MSRIT), Bengaluru", country: "India", city: "Bengaluru", category: "India State / Private" },
  { name: "Amity University (Noida / Mumbai / Lucknow / Jaipur)", country: "India", city: "Noida", category: "India State / Private" },
  { name: "LPU (Lovely Professional University)", country: "India", city: "Jalandhar", category: "India State / Private" },
  { name: "Chandigarh University", country: "India", city: "Mohali", category: "India State / Private" },
  { name: "KIIT Bhubaneswar", country: "India", city: "Bhubaneswar", category: "India State / Private" },
  { name: "Shiv Nadar University", country: "India", city: "Greater Noida", category: "India State / Private" },
  { name: "Plaksha University, Mohali", country: "India", city: "Mohali", category: "India State / Private" },

  // ── Global Tech & Premier International Universities ──
  { name: "MIT (Massachusetts Institute of Technology)", country: "United States", city: "Cambridge, MA", category: "Global Top Tech" },
  { name: "Stanford University", country: "United States", city: "Stanford, CA", category: "Global Top Tech" },
  { name: "Carnegie Mellon University (CMU)", country: "United States", city: "Pittsburgh, PA", category: "Global Top Tech" },
  { name: "UC Berkeley (University of California, Berkeley)", country: "United States", city: "Berkeley, CA", category: "Global Top Tech" },
  { name: "Georgia Institute of Technology (Georgia Tech)", country: "United States", city: "Atlanta, GA", category: "Global Top Tech" },
  { name: "University of Washington (UW)", country: "United States", city: "Seattle, WA", category: "Global Top Tech" },
  { name: "University of Illinois Urbana-Champaign (UIUC)", country: "United States", city: "Urbana, IL", category: "Global Top Tech" },
  { name: "University of Oxford", country: "United Kingdom", city: "Oxford", category: "Global Top Tech" },
  { name: "University of Cambridge", country: "United Kingdom", city: "Cambridge", category: "Global Top Tech" },
  { name: "Imperial College London", country: "United Kingdom", city: "London", category: "Global Top Tech" },
  { name: "University College London (UCL)", country: "United Kingdom", city: "London", category: "Global Top Tech" },
  { name: "University of Waterloo", country: "Canada", city: "Waterloo, ON", category: "Global Top Tech" },
  { name: "University of Toronto", country: "Canada", city: "Toronto, ON", category: "Global Top Tech" },
  { name: "UBC (University of British Columbia)", country: "Canada", city: "Vancouver, BC", category: "Global Top Tech" },
  { name: "NUS (National University of Singapore)", country: "Singapore", city: "Singapore", category: "Global Top Tech" },
  { name: "NTU (Nanyang Technological University)", country: "Singapore", city: "Singapore", category: "Global Top Tech" },
  { name: "ETH Zurich (Swiss Federal Institute of Technology)", country: "Switzerland", city: "Zurich", category: "Global Top Tech" },
  { name: "EPFL (École Polytechnique Fédérale de Lausanne)", country: "Switzerland", city: "Lausanne", category: "Global Top Tech" },
  { name: "TU Munich (Technical University of Munich)", country: "Germany", city: "Munich", category: "Global Top Tech" },
  { name: "RWTH Aachen University", country: "Germany", city: "Aachen", category: "Global Top Tech" },
  { name: "University of Melbourne", country: "Australia", city: "Melbourne", category: "Global Top Tech" },
  { name: "UNSW Sydney (University of New South Wales)", country: "Australia", city: "Sydney", category: "Global Top Tech" },
  { name: "Australian National University (ANU)", country: "Australia", city: "Canberra", category: "Global Top Tech" },
  { name: "Khalifa University", country: "United Arab Emirates", city: "Abu Dhabi", category: "Global Top Tech" },
  { name: "American University of Sharjah (AUS)", country: "United Arab Emirates", city: "Sharjah", category: "Global Top Tech" }
];
