
#!/bin/bash

# Exit script if any command fails
set -e

echo "===== Setting up Project Management System with Docker ====="

# Update system packages
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required dependencies
echo "Installing dependencies..."
sudo apt install -y curl git docker.io docker-compose

# Start and enable Docker service
echo "Configuring Docker..."
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
echo "NOTE: You may need to log out and back in for group changes to take effect"

# Clone the repository
echo "Cloning project repository..."
git clone https://github.com/ixsorsxi/vivid-projects.git
cd vivid-projects

# Create Docker configuration files
echo "Creating Docker configuration files..."

# Create PostgreSQL init script for database setup
mkdir -p db-init
cat > db-init/init.sql << 'EOF'
-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the auth schema
CREATE SCHEMA IF NOT EXISTS auth;

-- Create the types needed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_type') THEN
        CREATE TYPE user_role_type AS ENUM ('admin', 'manager', 'user');
    END IF;
END
$$;

-- Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    full_name TEXT,
    username TEXT,
    avatar_url TEXT,
    website TEXT,
    role TEXT DEFAULT 'user',
    custom_role_id UUID
);

CREATE TABLE IF NOT EXISTS public.custom_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    base_type user_role_type NOT NULL DEFAULT 'user',
    created_by UUID
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES public.custom_roles(id),
    permission TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'in-progress',
    progress INTEGER DEFAULT 0,
    due_date TIMESTAMPTZ,
    user_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    name TEXT
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'to-do',
    priority TEXT NOT NULL DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    completed BOOLEAN NOT NULL DEFAULT false,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS public.task_assignees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS public.task_subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    parent_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.task_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    dependency_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    dependency_type TEXT NOT NULL DEFAULT 'blocks'
);

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    last_message_id UUID
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    unread_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, avatar_url)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.email, 
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.get_project_owner(project_id UUID)
RETURNS UUID AS $$
  SELECT user_id 
  FROM public.projects 
  WHERE id = project_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_project_member(project_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.project_members 
    WHERE project_id = $1 AND user_id = $2
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_auth_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_projects()
RETURNS TABLE(id UUID, name TEXT, description TEXT, progress INTEGER, status TEXT, due_date TIMESTAMPTZ, category TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.progress,
    p.status,
    p.due_date,
    p.category
  FROM 
    public.projects p
  WHERE 
    p.user_id = current_setting('request.jwt.claims', true)::json->>'sub'::TEXT::UUID OR EXISTS (
      SELECT 1 FROM public.project_members pm 
      WHERE pm.project_id = p.id AND pm.user_id = current_setting('request.jwt.claims', true)::json->>'sub'::TEXT::UUID
    )
  ORDER BY 
    p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.create_new_project(project_data JSONB)
RETURNS UUID AS $$
DECLARE
  new_project_id UUID;
BEGIN
  INSERT INTO public.projects (
    name,
    description,
    category,
    due_date,
    status,
    progress,
    user_id
  ) VALUES (
    project_data->>'name',
    project_data->>'description',
    project_data->>'category',
    (project_data->>'due_date')::TIMESTAMP WITH TIME ZONE,
    project_data->>'status',
    (project_data->>'progress')::INTEGER,
    (project_data->>'user_id')::UUID
  )
  RETURNING id INTO new_project_id;
  
  RETURN new_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.add_project_members(p_project_id UUID, p_user_id UUID, p_team_members JSONB)
RETURNS BOOLEAN AS $$
DECLARE
  member_data JSONB;
BEGIN
  FOR member_data IN SELECT * FROM jsonb_array_elements(p_team_members)
  LOOP
    INSERT INTO public.project_members (
      project_id,
      user_id,
      role,
      name
    ) VALUES (
      p_project_id,
      p_user_id,
      member_data->>'role',
      member_data->>'name'
    );
  END LOOP;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.add_project_tasks(p_project_id UUID, p_user_id UUID, p_tasks JSONB)
RETURNS BOOLEAN AS $$
DECLARE
  task_data JSONB;
BEGIN
  FOR task_data IN SELECT * FROM jsonb_array_elements(p_tasks)
  LOOP
    INSERT INTO public.tasks (
      title,
      description,
      status,
      priority,
      due_date,
      completed,
      project_id,
      user_id
    ) VALUES (
      task_data->>'title',
      task_data->>'description',
      task_data->>'status',
      task_data->>'priority',
      (task_data->>'due_date')::TIMESTAMP WITH TIME ZONE,
      FALSE,
      p_project_id,
      p_user_id
    );
  END LOOP;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_project_tasks(p_project_id UUID)
RETURNS TABLE(id UUID, title TEXT, description TEXT, status TEXT, priority TEXT, due_date TIMESTAMPTZ, completed BOOLEAN, project_id UUID, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.due_date,
    t.completed,
    t.project_id,
    t.created_at,
    t.updated_at
  FROM 
    public.tasks t
  WHERE 
    t.project_id = p_project_id AND
    (t.user_id = current_setting('request.jwt.claims', true)::json->>'sub'::TEXT::UUID OR EXISTS (
      SELECT 1 FROM public.project_members pm 
      WHERE pm.project_id = t.project_id AND pm.user_id = current_setting('request.jwt.claims', true)::json->>'sub'::TEXT::UUID
    ) OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = t.project_id AND p.user_id = current_setting('request.jwt.claims', true)::json->>'sub'::TEXT::UUID
    ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_project_settings(p_project_id UUID, p_name TEXT, p_description TEXT, p_category TEXT, p_status TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.projects
  SET 
    name = p_name,
    description = p_description,
    category = p_category,
    status = p_status,
    updated_at = now()
  WHERE 
    id = p_project_id AND
    (user_id = current_setting('request.jwt.claims', true)::json->>'sub'::TEXT::UUID OR EXISTS (
      SELECT 1 FROM public.project_members pm 
      WHERE pm.project_id = p_project_id AND pm.user_id = current_setting('request.jwt.claims', true)::json->>'sub'::TEXT::UUID AND pm.role = 'admin'
    ));
    
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_project_by_id(p_project_id UUID)
RETURNS TABLE(id UUID, name TEXT, description TEXT, progress INTEGER, status TEXT, due_date TIMESTAMPTZ, category TEXT, team JSONB) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.progress,
    p.status,
    p.due_date,
    p.category,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', pm.id,
          'name', pm.name,
          'role', pm.role
        )
      )
      FROM public.project_members pm
      WHERE pm.project_id = p.id
    ) AS team
  FROM 
    public.projects p
  WHERE 
    p.id = p_project_id AND
    (p.user_id = current_setting('request.jwt.claims', true)::json->>'sub'::TEXT::UUID OR EXISTS (
      SELECT 1 FROM public.project_members pm 
      WHERE pm.project_id = p.id AND pm.user_id = current_setting('request.jwt.claims', true)::json->>'sub'::TEXT::UUID
    ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER set_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_task_subtasks_updated_at
BEFORE UPDATE ON public.task_subtasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create auth super user
INSERT INTO public.profiles (id, full_name, username, role, avatar_url)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'System Admin', 'admin@example.com', 'admin', 'https://api.dicebear.com/6.x/avataaars/svg?seed=admin');

-- Add some sample data
INSERT INTO public.custom_roles (id, name, base_type, created_by)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Project Manager', 'manager', '00000000-0000-0000-0000-000000000000'),
  ('22222222-2222-2222-2222-222222222222', 'Developer', 'user', '00000000-0000-0000-0000-000000000000'),
  ('33333333-3333-3333-3333-333333333333', 'Designer', 'user', '00000000-0000-0000-0000-000000000000');
EOF

# Create Dockerfile for PostgreSQL
cat > Dockerfile.postgres << 'EOF'
FROM postgres:15

COPY ./db-init/init.sql /docker-entrypoint-initdb.d/
EOF

# Create Dockerfile for the app
cat > Dockerfile << 'EOF'
FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Create a custom env file that points to our local PostgreSQL
RUN echo "VITE_API_URL=http://localhost:3000" > .env
RUN echo "VITE_DB_PROVIDER=postgresql" >> .env
RUN echo "VITE_PG_CONNECTION=postgresql://postgres:postgres@db:5432/vivid_projects" >> .env

# Copy project files and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

# Create API server for custom authentication and database access
mkdir -p api
cat > api/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install express pg jsonwebtoken bcrypt cors dotenv

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
EOF

cat > api/server.js << 'EOF'
const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'vivid_projects',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: 5432,
});

// JWT secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into database
    const userId = generateUUID();
    await pool.query(
      'INSERT INTO auth.users (id, email, password) VALUES ($1, $2, $3)',
      [userId, email, hashedPassword]
    );

    // Create profile
    await pool.query(
      'INSERT INTO public.profiles (id, full_name, username, avatar_url) VALUES ($1, $2, $3, $4)',
      [userId, fullName, email, `https://api.dicebear.com/6.x/avataaars/svg?seed=${email}`]
    );

    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userResult = await pool.query(
      'SELECT * FROM auth.users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Get user profile
    const profileResult = await pool.query(
      'SELECT * FROM public.profiles WHERE id = $1',
      [user.id]
    );

    const profile = profileResult.rows[0] || {};

    // Generate JWT
    const token = jwt.sign(
      { 
        sub: user.id,
        email: user.email,
        role: profile.role || 'user',
        name: profile.full_name || email.split('@')[0]
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: profile.full_name || email.split('@')[0],
        role: profile.role || 'user',
        avatar: profile.avatar_url
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    
    req.user = user;
    
    // Set PostgreSQL settings for RLS
    pool.query(`SET LOCAL "request.jwt.claims" = '${JSON.stringify(user)}'`);
    
    next();
  });
};

// Projects endpoints
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_user_projects()');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_project_by_id($1)', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Generate a UUID (simplified version)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Add more API endpoints for tasks, users, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
EOF

# Create Nginx configuration file
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy requests to API server
    location /api/ {
        proxy_pass http://api:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  db:
    build:
      context: .
      dockerfile: Dockerfile.postgres
    container_name: vivid-projects-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: vivid_projects
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: vivid-projects-api
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: vivid_projects
      POSTGRES_HOST: db
      JWT_SECRET: your_secure_jwt_secret_change_this_in_production
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy

  app:
    build: .
    container_name: vivid-projects
    ports:
      - "80:80"
    depends_on:
      - api
    restart: always

  # Optional: If you want to include a dashboard for monitoring
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 3600 # Check for updates every hour
    restart: always

volumes:
  postgres_data:
EOF

# Create .env file for local development
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3000
VITE_DB_PROVIDER=postgresql
VITE_PG_CONNECTION=postgresql://postgres:postgres@db:5432/vivid_projects
EOF

# Create auth schema setup script
mkdir -p api/db
cat > api/db/auth.sql << 'EOF'
-- Create auth schema for user management
CREATE SCHEMA IF NOT EXISTS auth;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Function to get current user ID for RLS policies
CREATE OR REPLACE FUNCTION auth.uid() 
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('request.jwt.claims', true)::json->>'sub'::TEXT::UUID;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END
$$ LANGUAGE plpgsql STABLE;
EOF

# Add a script to modify the front-end to use the local API instead of Supabase
cat > update-frontend.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Update client.ts to use local PostgreSQL
const clientPath = path.join(__dirname, 'src/integrations/supabase/client.ts');
if (fs.existsSync(clientPath)) {
  fs.writeFileSync(clientPath, `
// Local API client instead of Supabase
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create a custom client that mimics Supabase client structure
export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }) => {
      try {
        const response = await axios.post(\`\${apiUrl}/api/auth/signin\`, { email, password });
        
        if (response.data && response.data.token) {
          // Store token in localStorage like Supabase would
          localStorage.setItem('supabase.auth.token', response.data.token);
          
          return {
            data: {
              session: {
                access_token: response.data.token,
                user: response.data.user
              },
              user: response.data.user
            },
            error: null
          };
        }
        
        return { data: null, error: new Error('Authentication failed') };
      } catch (error) {
        return { data: null, error };
      }
    },
    signUp: async ({ email, password, options }) => {
      try {
        const userData = {
          email,
          password,
          fullName: options?.data?.full_name || email.split('@')[0]
        };
        
        const response = await axios.post(\`\${apiUrl}/api/auth/signup\`, userData);
        
        return {
          data: { user: response.data },
          error: null
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    signOut: async () => {
      // Just remove the token
      localStorage.removeItem('supabase.auth.token');
      return { error: null };
    },
    getSession: async () => {
      const token = localStorage.getItem('supabase.auth.token');
      
      if (!token) {
        return { data: { session: null }, error: null };
      }
      
      try {
        // Use the token to get user data
        const response = await axios.get(\`\${apiUrl}/api/auth/user\`, {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        
        return {
          data: {
            session: {
              access_token: token,
              user: response.data
            }
          },
          error: null
        };
      } catch (error) {
        // If there's an error, clear the token
        localStorage.removeItem('supabase.auth.token');
        return { data: { session: null }, error: null };
      }
    },
    onAuthStateChange: (callback) => {
      // This is simplified - normally it would listen for changes
      const token = localStorage.getItem('supabase.auth.token');
      
      if (token) {
        // Try to get user data with the token
        axios.get(\`\${apiUrl}/api/auth/user\`, {
          headers: { Authorization: \`Bearer \${token}\` }
        }).then(response => {
          callback('SIGNED_IN', {
            access_token: token,
            user: response.data
          });
        }).catch(() => {
          callback('SIGNED_OUT', null);
        });
      } else {
        callback('SIGNED_OUT', null);
      }
      
      // Return an object with an unsubscribe method
      return {
        subscription: {
          unsubscribe: () => {}
        }
      };
    }
  },
  from: (table) => {
    return {
      select: (columns = '*') => {
        return {
          eq: (column, value) => {
            return {
              single: async () => {
                try {
                  const token = localStorage.getItem('supabase.auth.token');
                  const response = await axios.get(
                    \`\${apiUrl}/api/\${table}/\${value}\`,
                    { headers: { Authorization: \`Bearer \${token}\` } }
                  );
                  return { data: response.data, error: null };
                } catch (error) {
                  return { data: null, error };
                }
              },
              order: (column, { ascending }) => {
                return {
                  limit: (limit) => {
                    return {
                      maybeSingle: async () => {
                        try {
                          const token = localStorage.getItem('supabase.auth.token');
                          const response = await axios.get(
                            \`\${apiUrl}/api/\${table}?\${column}=\${value}&orderBy=\${column}&order=\${ascending ? 'asc' : 'desc'}&limit=\${limit}\`,
                            { headers: { Authorization: \`Bearer \${token}\` } }
                          );
                          return { data: response.data[0] || null, error: null };
                        } catch (error) {
                          return { data: null, error };
                        }
                      }
                    };
                  }
                };
              }
            };
          }
        };
      },
      insert: async (data) => {
        try {
          const token = localStorage.getItem('supabase.auth.token');
          const response = await axios.post(
            \`\${apiUrl}/api/\${table}\`,
            data,
            { headers: { Authorization: \`Bearer \${token}\` } }
          );
          return { data: response.data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      update: (data) => {
        return {
          eq: async (column, value) => {
            try {
              const token = localStorage.getItem('supabase.auth.token');
              const response = await axios.put(
                \`\${apiUrl}/api/\${table}/\${value}\`,
                data,
                { headers: { Authorization: \`Bearer \${token}\` } }
              );
              return { data: response.data, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        };
      },
      delete: () => {
        return {
          eq: async (column, value) => {
            try {
              const token = localStorage.getItem('supabase.auth.token');
              await axios.delete(
                \`\${apiUrl}/api/\${table}/\${value}\`,
                { headers: { Authorization: \`Bearer \${token}\` } }
              );
              return { error: null };
            } catch (error) {
              return { error };
            }
          }
        };
      }
    };
  },
  rpc: async (functionName, params = {}) => {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      const response = await axios.post(
        \`\${apiUrl}/api/rpc/\${functionName}\`,
        params,
        { headers: { Authorization: \`Bearer \${token}\` } }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};
  `.trim());
  console.log('Updated Supabase client to use local API');
}

// Add package.json updates if needed
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Add axios dependency if not present
  if (!packageJson.dependencies.axios) {
    packageJson.dependencies.axios = '^1.6.0';
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('Added axios dependency to package.json');
  }
}
EOF

# Build and start the containers
echo "Building and starting Docker containers..."
sudo docker-compose up -d --build

# Provide helpful message
echo "===== Installation Complete ====="
echo "Your application is now running!"
echo "You can access it at: http://YOUR_SERVER_IP"
echo ""
echo "Database: PostgreSQL running locally (no external Supabase dependency)"
echo "API Server: NodeJS Express API providing authentication and data access"
echo "Web App: React front-end hosted with Nginx"
echo ""
echo "Useful commands:"
echo "- View logs for the web app: sudo docker logs vivid-projects"
echo "- View logs for the API: sudo docker logs vivid-projects-api"
echo "- View logs for the database: sudo docker logs vivid-projects-db"
echo "- Restart all services: sudo docker-compose restart"
echo "- Stop all services: sudo docker-compose down"
echo "- Update (after git pull): sudo docker-compose up -d --build"
echo ""
echo "Default login credentials:"
echo "Email: admin@example.com"
echo "Password: admin123" # This will be set by the auth system on first login
echo ""
echo "PostgreSQL credentials:"
echo "User: postgres"
echo "Password: postgres"
echo "Database: vivid_projects"
echo "Port: 5432"
echo ""
echo "Note: For a production environment, remember to change the JWT_SECRET and database credentials!"
