export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'TitanOs Backend API',
    version: '1.0.0',
    description: 'Sports management platform — REST API documentation',
  },
  servers: [{ url: '/api', description: 'API base path' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  role: { type: 'string', enum: ['PLAYER', 'FAN'], description: 'Self-service registration; ADMIN/STAFF are assigned separately' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User created' },
          400: { description: 'Validation error', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive access token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Returns accessToken, sets refreshToken HttpOnly cookie' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/refresh': {
      post: { tags: ['Auth'], summary: 'Rotate refresh token', security: [], responses: { 200: { description: 'New accessToken returned' } } },
    },
    '/auth/logout': {
      post: { tags: ['Auth'], summary: 'Logout and clear session', responses: { 204: { description: 'Logged out' } } },
    },
    '/sport/teams': {
      get: { tags: ['Sport'], summary: 'List all teams', responses: { 200: { description: 'Array of teams' } } },
      post: { tags: ['Sport'], summary: 'Create a team (ADMIN/STAFF)', responses: { 201: { description: 'Team created' } } },
    },
    '/sport/members': {
      get: { tags: ['Sport'], summary: 'List all members', responses: { 200: { description: 'Array of members' } } },
      post: { tags: ['Sport'], summary: 'Create a member (ADMIN/STAFF)', responses: { 201: { description: 'Member created' } } },
    },
    '/sport/sessions': {
      get: { tags: ['Sport'], summary: 'List sessions', responses: { 200: { description: 'Array of sessions' } } },
      post: { tags: ['Sport'], summary: 'Create session (ADMIN/STAFF)', responses: { 201: { description: 'Session created' } } },
    },
    '/medical/records': {
      get: { tags: ['Medical'], summary: 'List medical records (ADMIN/STAFF)', responses: { 200: { description: 'Array of medical records' } } },
      post: { tags: ['Medical'], summary: 'Create medical record (ADMIN/STAFF)', responses: { 201: { description: 'Record created' } } },
    },
    '/wellness/forms': {
      get: { tags: ['Wellness'], summary: 'List wellness forms (ADMIN/STAFF)', responses: { 200: { description: 'Array of wellness forms' } } },
      post: { tags: ['Wellness'], summary: 'Submit wellness form (ADMIN/STAFF/PLAYER)', responses: { 201: { description: 'Form submitted' } } },
    },
    '/ai/analyze': {
      post: { tags: ['AI'], summary: 'Trigger AI wellness analysis for a member (ADMIN/STAFF)', responses: { 201: { description: 'AIInsight created' } } },
    },
    '/ai/manual': {
      post: { tags: ['AI'], summary: 'Create manual AI insight fallback (ADMIN/STAFF)', responses: { 201: { description: 'AIInsight created manually' } } },
    },
    '/media/upload': {
      post: { tags: ['Media'], summary: 'Upload a file to MinIO (multipart/form-data)', responses: { 201: { description: 'Media uploaded and metadata stored' } } },
    },
    '/fan/matches': {
      get: { tags: ['Fan'], summary: 'List all matches', responses: { 200: { description: 'Array of matches' } } },
      post: { tags: ['Fan'], summary: 'Create match (ADMIN/STAFF)', responses: { 201: { description: 'Match created' } } },
    },
    '/fan/events/{id}': {
      patch: { tags: ['Fan'], summary: 'Update match event (ADMIN/STAFF)', responses: { 200: { description: 'Event updated' } } },
    },
    '/fan/actions': {
      post: { tags: ['Fan'], summary: 'Submit fan action (vote, ticket, like, share)', responses: { 201: { description: 'Action recorded' } } },
    },
    '/audit': {
      get: { tags: ['Audit'], summary: 'List all audit logs (ADMIN only)', responses: { 200: { description: 'Array of audit logs' } } },
    },
    '/health': {
      get: { tags: ['System'], summary: 'Health check', security: [], responses: { 200: { description: 'Service is healthy' } } },
    },
  },
};
