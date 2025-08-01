-- Role in an event
CREATE TYPE participant_role AS ENUM ('organizer', 'collaborator', 'attendee');

-- Task priority
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Task status
CREATE TYPE task_status AS ENUM ('todo', 'in-progress', 'done');

-- Resource type
CREATE TYPE resource_type AS ENUM ('venue', 'equipment', 'financial', 'other');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    is_cancelled BOOLEAN DEFAULT FALSE,
    created_by UUID,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE event_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role participant_role NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    priority task_priority NOT NULL,
    status task_status NOT NULL,
    due_date DATETIME NOT NULL,
    assigned_to UUID NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    name VARCHAR NOT NULL,
    type resource_type NOT NULL,
    allocated_to UUID NULL,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (allocated_to) REFERENCES users(id)
);
