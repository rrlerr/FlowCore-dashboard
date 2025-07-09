// Local AI Assistant - No external APIs required
// Uses keyword matching and intent recognition for FlowCore business management

interface AIResponse {
  action: "navigate" | "create" | "respond" | "open_modal";
  module?: string;
  type?: string;
  data?: any;
  message?: string;
}

// Common typos and variations
const FUZZY_MATCHES = {
  // Navigation terms
  "dashbord": "dashboard",
  "dashbaord": "dashboard",
  "crm": "crm",
  "customer": "crm",
  "lead": "crm",
  "leads": "crm",
  "ticket": "tickets",
  "tiket": "tickets",
  "tickets": "tickets",
  "support": "tickets",
  "sale": "sales",
  "sales": "sales",
  "revenue": "sales",
  "deal": "sales",
  "deals": "sales",
  "project": "projects",
  "projects": "projects",
  "task": "projects",
  "tasks": "projects",
  "email": "email",
  "mail": "email",
  "emails": "email",
  
  // Actions
  "creat": "create",
  "create": "create",
  "add": "create",
  "new": "create",
  "make": "create",
  "open": "navigate",
  "show": "navigate",
  "go": "navigate",
  "goto": "navigate",
  "view": "navigate",
  "edit": "edit",
  "update": "edit",
  "modify": "edit",
  "delete": "delete",
  "remove": "delete",
  
  // Common misspellings
  "prject": "project",
  "projeect": "project",
  "leadd": "lead",
  "emial": "email",
  "emai": "email"
};

// Normalize text by fixing typos and converting to lowercase
function normalizeText(text: string): string {
  let normalized = text.toLowerCase().trim();
  
  // Replace common typos
  Object.entries(FUZZY_MATCHES).forEach(([typo, correct]) => {
    const regex = new RegExp(`\\b${typo}\\b`, 'gi');
    normalized = normalized.replace(regex, correct);
  });
  
  return normalized;
}

// Extract intent from user message
function extractIntent(message: string): { action: string; target: string; context: string[] } {
  const normalized = normalizeText(message);
  const words = normalized.split(/\s+/);
  
  let action = "respond";
  let target = "";
  const context: string[] = [];
  
  // Check for navigation intents
  if (words.some(word => ["go", "navigate", "open", "show", "view", "goto"].includes(word))) {
    action = "navigate";
    
    if (words.some(word => ["dashboard", "home", "main"].includes(word))) {
      target = "dashboard";
    } else if (words.some(word => ["crm", "customer", "lead", "leads"].includes(word))) {
      target = "crm";
    } else if (words.some(word => ["ticket", "tickets", "support"].includes(word))) {
      target = "tickets";
    } else if (words.some(word => ["sales", "revenue", "deal", "deals"].includes(word))) {
      target = "sales";
    } else if (words.some(word => ["project", "projects", "task", "tasks"].includes(word))) {
      target = "projects";
    } else if (words.some(word => ["email", "mail", "emails"].includes(word))) {
      target = "email";
    }
  }
  
  // Check for creation intents
  if (words.some(word => ["create", "add", "new", "make"].includes(word))) {
    action = "create";
    
    if (words.some(word => ["lead", "customer", "contact"].includes(word))) {
      target = "lead";
    } else if (words.some(word => ["ticket", "support"].includes(word))) {
      target = "ticket";
    } else if (words.some(word => ["deal", "sale"].includes(word))) {
      target = "deal";
    } else if (words.some(word => ["project"].includes(word))) {
      target = "project";
    } else if (words.some(word => ["task"].includes(word))) {
      target = "task";
    } else if (words.some(word => ["email", "mail"].includes(word))) {
      target = "email";
    }
  }
  
  // Collect context words
  words.forEach(word => {
    if (["urgent", "high", "medium", "low", "priority"].includes(word)) {
      context.push(word);
    }
    if (["q1", "q2", "q3", "q4", "quarter", "monthly", "weekly"].includes(word)) {
      context.push(word);
    }
  });
  
  return { action, target, context };
}

// Generate helpful responses
function generateResponse(intent: { action: string; target: string; context: string[] }, originalMessage: string): AIResponse {
  const { action, target, context } = intent;
  
  // Navigation responses
  if (action === "navigate") {
    switch (target) {
      case "dashboard":
        return { action: "navigate", module: "dashboard", message: "Opening dashboard overview" };
      case "crm":
        return { action: "navigate", module: "crm", message: "Opening CRM module to manage leads and customers" };
      case "tickets":
        return { action: "navigate", module: "tickets", message: "Opening support tickets module" };
      case "sales":
        return { action: "navigate", module: "sales", message: "Opening sales and revenue module" };
      case "projects":
        return { action: "navigate", module: "projects", message: "Opening projects and tasks module" };
      case "email":
        return { action: "navigate", module: "email", message: "Opening email communication module" };
      default:
        return { action: "respond", message: "I can help you navigate to: Dashboard, CRM, Tickets, Sales, Projects, or Email. Which would you like to see?" };
    }
  }
  
  // Creation responses - trigger modal opening
  if (action === "create") {
    switch (target) {
      case "lead":
        return { 
          action: "open_modal", 
          type: "lead", 
          module: "crm",
          message: "I'll help you create a new lead. Opening the lead creation form..." 
        };
      case "ticket":
        return { 
          action: "open_modal", 
          type: "ticket", 
          module: "tickets",
          message: "I'll help you create a new support ticket. Opening the ticket creation form..." 
        };
      case "deal":
        return { 
          action: "open_modal", 
          type: "deal", 
          module: "sales",
          message: "I'll help you create a new deal. Opening the deal creation form..." 
        };
      case "project":
        return { 
          action: "open_modal", 
          type: "project", 
          module: "projects",
          message: "I'll help you create a new project. Opening the project creation form..." 
        };
      case "task":
        return { 
          action: "open_modal", 
          type: "task", 
          module: "projects",
          message: "I'll help you create a new task. Opening the task creation form..." 
        };
      case "email":
        return { 
          action: "open_modal", 
          type: "email", 
          module: "email",
          message: "I'll help you compose a new email. Opening the email composer..." 
        };
      default:
        return { action: "respond", message: "I can help you create: leads, tickets, deals, projects, tasks, or emails. What would you like to create?" };
    }
  }
  
  // Handle common business queries
  const lowerMessage = originalMessage.toLowerCase();
  
  if (lowerMessage.includes("sales") && (lowerMessage.includes("report") || lowerMessage.includes("chart"))) {
    return { action: "navigate", module: "sales", message: "Opening sales module where you can view charts and reports" };
  }
  
  if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
    return { 
      action: "respond", 
      message: "I can help you with:\n• Navigate between modules (CRM, Tickets, Sales, Projects, Email)\n• Create new leads, tickets, deals, projects, or tasks\n• Open forms and modals\n• Find information\n\nJust ask me naturally like 'create a new ticket' or 'show me the sales page'!" 
    };
  }
  
  if (lowerMessage.includes("stats") || lowerMessage.includes("overview") || lowerMessage.includes("summary")) {
    return { action: "navigate", module: "dashboard", message: "Opening dashboard to show your business overview and stats" };
  }
  
  // Default response with suggestions
  return { 
    action: "respond", 
    message: "I'm here to help! Try asking me to:\n• 'Open CRM' or 'Show tickets'\n• 'Create a new lead' or 'Add a ticket'\n• 'Navigate to sales' or 'Go to projects'\n• 'Help me with...' for more options" 
  };
}

// Main processing function
export async function processLocalAIMessage(message: string): Promise<AIResponse> {
  if (!message || message.trim().length === 0) {
    return { action: "respond", message: "Please let me know how I can help you!" };
  }
  
  // Extract intent from the message
  const intent = extractIntent(message);
  
  // Generate appropriate response
  const response = generateResponse(intent, message);
  
  return response;
}

// Helper function to suggest corrections for unclear requests
export function suggestCorrections(message: string): string[] {
  const normalized = normalizeText(message);
  const suggestions: string[] = [];
  
  if (normalized.includes("crate") || normalized.includes("creat")) {
    suggestions.push("Did you mean 'create'?");
  }
  
  if (normalized.includes("tiket") || normalized.includes("tickt")) {
    suggestions.push("Did you mean 'ticket'?");
  }
  
  if (normalized.includes("prject") || normalized.includes("projet")) {
    suggestions.push("Did you mean 'project'?");
  }
  
  return suggestions;
}