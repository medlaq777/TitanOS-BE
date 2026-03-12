const ok = (tag, summary, schemaName) => ({
  tags: [tag],
  summary,
  responses: {
    200: {
      description: "OK",
      content: schemaName ? { "application/json": { schema: { $ref: `#/components/schemas/${schemaName}` } } } : undefined
    }
  }
});

const created = (tag, summary, schemaName) => ({
  tags: [tag],
  summary,
  responses: {
    201: {
      description: "Created",
      content: schemaName ? { "application/json": { schema: { $ref: `#/components/schemas/${schemaName}` } } } : undefined
    }
  }
});

const noContent = (tag, summary) => ({
  tags: [tag],
  summary,
  responses: {
    204: { description: "No Content" }
  }
});

const logic = (tag, summary, reqSchema, resSchema) => ({
  tags: [tag],
  summary,
  requestBody: reqSchema ? {
    required: true,
    content: { "application/json": { schema: { $ref: `#/components/schemas/${reqSchema}` } } }
  } : undefined,
  responses: {
    200: {
      description: "OK",
      content: resSchema ? { "application/json": { schema: { $ref: `#/components/schemas/${resSchema}` } } } : undefined
    }
  }
});

const errorResponse = {
  description: "Error",
  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
};

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "TitanOS Backend API",
    version: "1.5.0",
    description: "Multi-tenant Sports Management System. RBAC enforced across 14 domain entities.",
  },
  servers: [{ url: "/api", description: "API Base" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Error: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Detailed error message" },
          error: { type: "object", properties: { code: { type: "string" }, issues: { type: "array", items: { type: "object" } } } }
        }
      },
      // 14 Core Entity Schemas
      User: { type: "object", properties: { _id: { type: "string" }, firstName: { type: "string" }, lastName: { type: "string" }, email: { type: "string" }, role: { type: "string", enum: ["ADMIN", "COACH", "MEDICAL", "PLAYER", "FAN"] }, isActive: { type: "boolean" } } },
      Team: { type: "object", properties: { _id: { type: "string" }, name: { type: "string" }, shortCode: { type: "string" }, stadiumName: { type: "string" }, logoUrl: { type: "string" } } },
      Member: { type: "object", properties: { _id: { type: "string" }, teamId: { type: "string" }, userId: { type: "string" }, clubRole: { type: "string" }, contractStatus: { type: "string" }, defaultPosition: { type: "string" }, defaultJerseyNumber: { type: "number" }, joinDate: { type: "string", format: "date-time" } } },
      Season: { type: "object", properties: { _id: { type: "string" }, name: { type: "string" }, startDate: { type: "string", format: "date-time" }, endDate: { type: "string", format: "date-time" }, isActive: { type: "boolean" } } },
      Match: { type: "object", properties: { _id: { type: "string" }, seasonId: { type: "string" }, type: { type: "string" }, opponentName: { type: "string" }, matchSide: { type: "string" }, scheduledAt: { type: "string", format: "date-time" }, status: { type: "string" }, calledUpSquad: { type: "array", items: { type: "string" } } } },
      MatchDetails: { type: "object", properties: { _id: { type: "string" }, matchId: { type: "string" }, stadium: { type: "string" }, referee: { type: "string" }, ourScore: { type: "number" }, opponentScore: { type: "number" }, starters: { type: "array", items: { type: "string" } }, substitutes: { type: "array", items: { type: "string" } } } },
      MatchEvent: { type: "object", properties: { _id: { type: "string" }, type: { type: "string" }, memberId: { type: "string" }, minute: { type: "number" }, notes: { type: "string" } } },
      Session: { type: "object", properties: { _id: { type: "string" }, title: { type: "string" }, type: { type: "string" }, date: { type: "string", format: "date-time" }, durationMinutes: { type: "number" } } },
      MatchPerformance: { type: "object", properties: { _id: { type: "string" }, matchDetailsId: { type: "string" }, memberId: { type: "string" }, rating: { type: "number" }, minutesPlayed: { type: "number" }, goals: { type: "number" }, assists: { type: "number" } } },
      SessionPerformance: { type: "object", properties: { _id: { type: "string" }, sessionId: { type: "string" }, memberId: { type: "string" }, rating: { type: "number" }, intensityLevel: { type: "number" }, coachNotes: { type: "string" } } },
      MedicalRecord: { type: "object", properties: { _id: { type: "string" }, memberId: { type: "string" }, status: { type: "string" }, injuryType: { type: "string" }, estimatedReturnDate: { type: "string", format: "date-time" } } },
      Article: { type: "object", properties: { _id: { type: "string" }, title: { type: "string" }, content: { type: "string" }, status: { type: "string" }, publishedAt: { type: "string", format: "date-time" } } },
      MediaAsset: { type: "object", properties: { _id: { type: "string" }, linkedId: { type: "string" }, fileUrl: { type: "string" }, objectName: { type: "string" }, fileType: { type: "string" } } },
      FanEngagement: { type: "object", properties: { _id: { type: "string" }, userId: { type: "string" }, matchId: { type: "string" }, type: { type: "string" }, metadata: { type: "object" } } },
      
      // Request Payload Schemas (Examples)
      SetLineupRequest: {
        type: "object",
        properties: {
          starters: { type: "array", items: { type: "string" }, example: ["60d5f2...", "60d5f3..."] },
          subs: { type: "array", items: { type: "string" }, example: ["60d5f4..."] }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // Auth Pattern
    "/auth/register": { post: created("Auth", "Register account") },
    "/auth/login": { post: ok("Auth", "User login") },
    
    // 14 Entity Patterns
    "/users": { post: created("Users", "Create user", "User"), get: ok("Users", "List users") },
    "/users/{id}": { get: ok("Users", "Get by ID", "User"), put: ok("Users", "Update user"), delete: noContent("Users", "Delete user") },
    "/users/{id}/authenticate": { post: logic("Users", "Validate password") },
    "/users/{id}/generate-tokens": { post: logic("Users", "Generate JWT set") },
    "/users/{id}/update-password": { post: logic("Users", "Secure password update") },
    
    "/teams": { post: created("Teams", "Create team", "Team"), get: ok("Teams", "List teams") },
    "/teams/{id}": { get: ok("Teams", "Get by ID", "Team"), put: ok("Teams", "Update team"), delete: noContent("Teams", "Delete user") },
    "/teams/{id}/get-squad-list": { post: logic("Teams", "Get squad IDs") },
    
    "/members": { post: created("Members", "Create member", "Member"), get: ok("Members", "List members") },
    "/members/{id}": { get: ok("Members", "Get by ID", "Member"), put: ok("Members", "Update member") },
    "/members/{id}/get-medical-clearance": { post: logic("Members", "Check rehab status") },
    
    "/matches": { post: created("Matches", "Create match", "Match"), get: ok("Matches", "List matches") },
    "/matches/{id}": { get: ok("Matches", "Get by ID", "Match"), put: ok("Matches", "Update match") },
    "/matches/{id}/set-lineup": { post: logic("Matches", "Set squad for match day", "SetLineupRequest") },
    "/matches/{id}/start-match": { post: logic("Matches", "Go live") },
    
    "/match-details": { post: created("MatchDetails", "Create record", "MatchDetails"), get: ok("MatchDetails", "List details") },
    "/match-details/{id}/finish-match": { post: logic("MatchDetails", "Close match with final score") },
    
    "/match-events": { post: created("MatchEvents", "Track event", "MatchEvent") },
    "/match-events/{id}": { get: ok("MatchEvents", "Get by ID") },
    
    "/sessions": { post: created("Sessions", "Schedule session", "Session"), get: ok("Sessions", "List sessions") },
    "/sessions/{id}/mark-attendance": { post: logic("Sessions", "Track player presence") },
    
    "/match-performances": { post: created("MatchPerformances", "Log stats", "MatchPerformance"), get: ok("MatchPerformances", "List performances") },
    "/match-performances/{id}/calculate-match-rating": { post: logic("MatchPerformances", "Auto-grade performance") },
    
    "/session-performances": { post: created("SessionPerformances", "Log session activity", "SessionPerformance") },
    
    "/medical-records": { post: created("MedicalRecords", "Log medical incident", "MedicalRecord"), get: ok("MedicalRecords", "List records") },
    "/medical-records/{id}/clear-player-for-selection": { post: logic("MedicalRecords", "Mark as cleared") },
    
    "/articles": { post: created("Articles", "Draft article", "Article"), get: ok("Articles", "List articles") },
    "/articles/{id}/publish": { post: logic("Articles", "Set live") },
    
    "/media-assets": { post: created("MediaAssets", "Register asset", "MediaAsset"), get: ok("MediaAssets", "List assets") },
    "/media-assets/{id}/generate-signed-url": { post: logic("MediaAssets", "Get Minio access URL") },
    
    "/fan-engagements": { post: created("FanEngagements", "Register activity", "FanEngagement"), get: ok("FanEngagements", "List activity") }
  }
};
