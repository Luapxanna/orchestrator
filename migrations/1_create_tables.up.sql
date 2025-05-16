
CREATE TABLE workflow (
    id TEXT PRIMARY KEY,
    input_params JSONB NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workflow_step (
    id SERIAL PRIMARY KEY,
    workflow_id TEXT REFERENCES workflow(id),
    step_index INTEGER NOT NULL,
    task_id TEXT NOT NULL,
    output JSONB,
    status TEXT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP
);

CREATE TABLE workflow_log (
    id SERIAL PRIMARY KEY,
    workflow_id TEXT REFERENCES workflow(id),
    step_index INTEGER,
    message TEXT NOT NULL,
    status TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);