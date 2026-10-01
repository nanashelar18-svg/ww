const fs = require('fs');
const path = require('path');

const dbFilePath = path.resolve(__dirname, '../../nexus-db.json');

// In-memory data store with disk persistence
let dbState = {
  users: [],
  departments: [],
  tickets: [],
  documents: [],
  workflows: [],
  workflow_runs: [],
  audit_logs: []
};

// Auto-load on startup
function loadDb() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf8');
      dbState = JSON.parse(raw);
    } else {
      saveDb();
    }
  } catch (err) {
    console.error('Failed to load database file:', err.message);
  }
}

function saveDb() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(dbState, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save database file:', err.message);
  }
}

loadDb();

// Generic helper methods
const db = {
  getState: () => dbState,
  save: saveDb,

  // Table operations
  users: {
    find: (predicate) => dbState.users.filter(predicate),
    findOne: (predicate) => dbState.users.find(predicate) || null,
    insert: (data) => {
      const id = dbState.users.length ? Math.max(...dbState.users.map(u => u.id || 0)) + 1 : 1;
      const record = { id, created_at: new Date().toISOString(), ...data };
      dbState.users.push(record);
      saveDb();
      return record;
    },
    update: (id, updates) => {
      const idx = dbState.users.findIndex(u => u.id === Number(id));
      if (idx !== -1) {
        dbState.users[idx] = { ...dbState.users[idx], ...updates, updated_at: new Date().toISOString() };
        saveDb();
        return dbState.users[idx];
      }
      return null;
    }
  },

  departments: {
    find: (predicate = () => true) => dbState.departments.filter(predicate),
    findOne: (predicate) => dbState.departments.find(predicate) || null,
    insert: (data) => {
      const id = dbState.departments.length ? Math.max(...dbState.departments.map(d => d.id || 0)) + 1 : 1;
      const record = { id, ...data };
      dbState.departments.push(record);
      saveDb();
      return record;
    }
  },

  tickets: {
    find: (predicate = () => true) => dbState.tickets.filter(predicate),
    findOne: (predicate) => dbState.tickets.find(predicate) || null,
    insert: (data) => {
      const id = dbState.tickets.length ? Math.max(...dbState.tickets.map(t => t.id || 0)) + 1 : 1;
      const record = { 
        id, 
        status: 'open', 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString(), 
        ...data 
      };
      dbState.tickets.unshift(record); // newest first
      saveDb();
      return record;
    },
    update: (id, updates) => {
      const idx = dbState.tickets.findIndex(t => t.id === Number(id));
      if (idx !== -1) {
        dbState.tickets[idx] = { ...dbState.tickets[idx], ...updates, updated_at: new Date().toISOString() };
        saveDb();
        return dbState.tickets[idx];
      }
      return null;
    },
    delete: (id) => {
      const initialLen = dbState.tickets.length;
      dbState.tickets = dbState.tickets.filter(t => t.id !== Number(id));
      saveDb();
      return dbState.tickets.length < initialLen;
    }
  },

  documents: {
    find: (predicate = () => true) => dbState.documents.filter(predicate),
    findOne: (predicate) => dbState.documents.find(predicate) || null,
    insert: (data) => {
      const id = dbState.documents.length ? Math.max(...dbState.documents.map(d => d.id || 0)) + 1 : 1;
      const record = { id, version: '1.0', created_at: new Date().toISOString(), ...data };
      dbState.documents.push(record);
      saveDb();
      return record;
    }
  },

  workflows: {
    find: (predicate = () => true) => dbState.workflows.filter(predicate),
    findOne: (predicate) => dbState.workflows.find(predicate) || null,
    insert: (data) => {
      const id = dbState.workflows.length ? Math.max(...dbState.workflows.map(w => w.id || 0)) + 1 : 1;
      const record = { id, execution_count: 0, active: 1, created_at: new Date().toISOString(), ...data };
      dbState.workflows.push(record);
      saveDb();
      return record;
    },
    incrementRun: (id) => {
      const w = dbState.workflows.find(item => item.id === Number(id));
      if (w) {
        w.execution_count = (w.execution_count || 0) + 1;
        saveDb();
      }
    }
  },

  workflow_runs: {
    find: (predicate = () => true) => dbState.workflow_runs.filter(predicate),
    insert: (data) => {
      const id = dbState.workflow_runs.length ? Math.max(...dbState.workflow_runs.map(r => r.id || 0)) + 1 : 1;
      const record = { id, created_at: new Date().toISOString(), ...data };
      dbState.workflow_runs.unshift(record);
      saveDb();
      return record;
    }
  },

  audit_logs: {
    find: (predicate = () => true) => dbState.audit_logs.filter(predicate),
    insert: (data) => {
      const id = dbState.audit_logs.length ? Math.max(...dbState.audit_logs.map(l => l.id || 0)) + 1 : 1;
      const record = { id, created_at: new Date().toISOString(), ...data };
      dbState.audit_logs.unshift(record);
      saveDb();
      return record;
    }
  }
};

module.exports = db;
