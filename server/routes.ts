import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertLeadSchema, insertTicketSchema, insertDealSchema, 
  insertProjectSchema, insertTaskSchema, insertEmailSchema 
} from "@shared/schema";
// Local AI assistant - no external APIs required
import { processLocalAIMessage } from "./localAI";

export async function registerRoutes(app: Express): Promise<Server> {
  // Leads routes
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.json(lead);
    } catch (error) {
      res.status(400).json({ message: "Invalid lead data" });
    }
  });

  app.put("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertLeadSchema.partial().parse(req.body);
      const lead = await storage.updateLead(id, updates);
      if (!lead) {
        res.status(404).json({ message: "Lead not found" });
        return;
      }
      res.json(lead);
    } catch (error) {
      res.status(400).json({ message: "Invalid lead data" });
    }
  });

  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLead(id);
      if (!success) {
        res.status(404).json({ message: "Lead not found" });
        return;
      }
      res.json({ message: "Lead deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete lead" });
    }
  });

  // Tickets routes
  app.get("/api/tickets", async (req, res) => {
    try {
      const tickets = await storage.getTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const ticketData = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(ticketData);
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ message: "Invalid ticket data" });
    }
  });

  app.put("/api/tickets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertTicketSchema.partial().parse(req.body);
      const ticket = await storage.updateTicket(id, updates);
      if (!ticket) {
        res.status(404).json({ message: "Ticket not found" });
        return;
      }
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ message: "Invalid ticket data" });
    }
  });

  app.delete("/api/tickets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTicket(id);
      if (!success) {
        res.status(404).json({ message: "Ticket not found" });
        return;
      }
      res.json({ message: "Ticket deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ticket" });
    }
  });

  // Deals routes
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getDeals();
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.post("/api/deals", async (req, res) => {
    try {
      const dealData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(dealData);
      res.json(deal);
    } catch (error) {
      res.status(400).json({ message: "Invalid deal data" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  // Emails routes
  app.get("/api/emails", async (req, res) => {
    try {
      const emails = await storage.getEmails();
      res.json(emails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emails" });
    }
  });

  app.post("/api/emails", async (req, res) => {
    try {
      const emailData = insertEmailSchema.parse(req.body);
      const email = await storage.createEmail(emailData);
      res.json(email);
    } catch (error) {
      res.status(400).json({ message: "Invalid email data" });
    }
  });

  // Local AI Assistant route - no external APIs required
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        res.status(400).json({ message: "Message is required" });
        return;
      }

      const result = await processLocalAIMessage(message.trim());
      res.json(result);
    } catch (error) {
      console.error("Local AI Chat error:", error);
      res.json({ 
        action: "respond", 
        message: "I'm sorry, I encountered an error. Please try again." 
      });
    }
  });

  // Stats route for dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      const tickets = await storage.getTickets();
      const deals = await storage.getDeals();
      const projects = await storage.getProjects();

      const stats = {
        totalLeads: leads.length,
        activeTickets: tickets.filter(t => t.status !== "resolved").length,
        totalRevenue: deals.reduce((sum, deal) => sum + deal.value, 0),
        activeProjects: projects.filter(p => p.status === "active").length,
        recentActivity: [
          ...leads.slice(-3).map(lead => ({
            type: "lead",
            message: `New lead created: ${lead.name}`,
            timestamp: lead.createdAt
          })),
          ...tickets.slice(-3).map(ticket => ({
            type: "ticket",
            message: `Ticket ${ticket.status}: ${ticket.title}`,
            timestamp: ticket.updatedAt || ticket.createdAt
          }))
        ].sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()).slice(0, 5)
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
