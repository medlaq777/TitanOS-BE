export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "TitanOS Backend API",
    version: "2.0.0",
    description: "API documentation auto-aligned with current backend routes and models. Only real, current endpoints and schemas are present."
  },
  servers: [{ url: "/api", description: "API base" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      // User
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string" },
          passwordHash: { type: "string" },
          phone: { type: "string" },
          status: { type: "string", enum: ["ACTIVE", "LOCKED", "INACTIVE"] },
          joinDate: { type: "string", format: "date-time" },
          role: { type: "string", enum: ["ADMIN", "USER"] },
          avatarUrl: { type: "string" }
        }
      },
      // Team
      Team: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          name: { type: "string" },
          shortName: { type: "string" },
          slogan: { type: "string" },
          description: { type: "string" },
          logoUrl: { type: "string" },
          colors: { type: "array", items: { type: "string" } },
          country: { type: "string" },
          city: { type: "string" },
          stadium: { type: "string" },
          stadiumCapacity: { type: "number" },
          founded: { type: "number" },
          trophyCount: { type: "number" },
          status: { type: "string", enum: ["active", "inactive"] }
        }
      },
      // Product
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          categoryId: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          stockQuantity: { type: "number" },
          imageUrl: { type: "string" }
        }
      },
      // Order
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          totalAmount: { type: "number" },
          orderDate: { type: "string", format: "date-time" },
          shippingAddress: { type: "string" },
          status: { type: "string", enum: ["PENDING", "PAID", "SHIPPED", "CANCELLED"] },
          paymentMethod: { type: "string" }
        }
      },
      // OrderItem
      OrderItem: {
        type: "object",
        properties: {
          _id: { type: "string" },
          orderId: { type: "string" },
          productId: { type: "string" },
          quantity: { type: "number" },
          unitPrice: { type: "number" },
          subtotal: { type: "number" }
        }
      },
      // Notification
      Notification: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          title: { type: "string" },
          message: { type: "string" },
          type: { type: "string" },
          isRead: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      // Match
      Match: {
        type: "object",
        properties: {
          _id: { type: "string" },
          team: { type: "string" },
          matchDate: { type: "string", format: "date-time" },
          matchTime: { type: "string" },
          matchOpponent: { type: "string" },
          matchCompetition: { type: "string", enum: ["LEAGUE", "CUP", "FRIENDLY", "TOURNAMENT", "OTHER"] },
          matchScore: { type: "number" },
          matchLocation: { type: "string", enum: ["HOME", "AWAY", "NEUTRAL"] },
          matchSaison: { type: "string" },
          status: { type: "string", enum: ["SCHEDULED", "LIVE", "FINISHED", "CANCELLED", "POSTPONED"] }
        }
      },
      // Loyalty
      Loyalty: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          points: { type: "number" },
          level: { type: "string", enum: ["BRONZE", "SILVER", "GOLD", "PLATINUM"] },
          rewards: { type: "array", items: { type: "string" } },
          lastActivity: { type: "string", format: "date-time" }
        }
      },
      // Category
      Category: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          isActive: { type: "boolean" }
        }
      },
      // Event
      Event: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          eventDate: { type: "string", format: "date-time" },
          location: { type: "string" },
          maxCapacity: { type: "number" }
        }
      },
      // Gallery
      Gallery: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          title: { type: "string" },
          mediaType: { type: "string" },
          url: { type: "string" },
          uploadDate: { type: "string", format: "date-time" }
        }
      },
      // Article
      Article: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          title: { type: "string" },
          content: { type: "string" },
          publishedDate: { type: "string", format: "date-time" },
          tags: { type: "array", items: { type: "string" } },
          imageUrl: { type: "string" },
          likes: { type: "array", items: { type: "object", properties: { userId: { type: "string" }, date: { type: "string", format: "date-time" } } } }
        }
      }
    }
  },
  paths: {
    // Only real, current endpoints will be defined here. Add endpoints as per the actual routes.
  }
};
