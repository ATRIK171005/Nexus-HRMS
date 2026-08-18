import os
import sqlite3
import pandas as pd
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rank_bm25 import BM25Okapi

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "hrms.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    # Using UNIQUE constraint on name to easily avoid duplicates
    c.execute('''CREATE TABLE IF NOT EXISTS employees 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, department TEXT, role TEXT, salary INTEGER)''')
    
    # Check if empty, then insert dummy
    c.execute('SELECT COUNT(*) FROM employees')
    if c.fetchone()[0] == 0:
        dummy_data = [
            ('Sofia Marchetti', 'HR', 'Manager', 85000),
            ('Neha Kapoor', 'Engineering', 'Data Engineer', 95000),
            ('Amara Osei', 'Product', 'Product Designer', 90000),
            ('Jonah Whitaker', 'Engineering', 'Frontend Developer', 88000),
            ('Tomas Kowalski', 'Marketing', 'Marketing Specialist', 70000),
            ('Priya Raghunathan', 'Sales', 'Sales Executive', 75000)
        ]
        c.executemany('INSERT OR IGNORE INTO employees (name, department, role, salary) VALUES (?,?,?,?)', dummy_data)
    conn.commit()
    conn.close()

init_db()

# BM25 Setup
documents = [
    "How many employees are in Engineering? You can query the department column.",
    "Who is the manager of HR? Look up the role and department.",
    "What is the salary of Sofia Marchetti? Check the name and salary columns.",
    "Show me all employees in Sales. Query the department.",
    "Export employee data. Use the Export button in the UI.",
    "Show all employees. Give me everyone.",
    "Average salary by department"
]
tokenized_corpus = [doc.split(" ") for doc in documents]
bm25 = BM25Okapi(tokenized_corpus)

class QueryRequest(BaseModel):
    text: str

def format_as_html_table(df):
    if df.empty:
        return "<p>No data found.</p>"
    
    html = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.85rem;">'
    html += '<thead style="background-color: var(--surface-2); text-align: left;"><tr>'
    for col in df.columns:
        html += f'<th style="padding: 8px; border-bottom: 2px solid var(--border); white-space: nowrap;">{col}</th>'
    html += '</tr></thead><tbody>'
    
    for _, row in df.iterrows():
        html += '<tr>'
        for val in row:
            html += f'<td style="padding: 8px; border-bottom: 1px solid var(--border); white-space: nowrap;">{val}</td>'
        html += '</tr>'
    html += '</tbody></table></div>'
    return html

@app.post("/copilot")
def ask_copilot(req: QueryRequest):
    query = req.text.strip()
    q_lower = query.lower()
    
    # Handle normal conversation
    conversational_responses = {
        "hi": "Hello! I am your Nexus HRMS Copilot. Try uploading a CSV or asking me to query your employee data!",
        "hello": "Hello! How can I assist you with your HR data today?",
        "hey": "Hey there! Need help querying your employee database?",
        "how are you": "I'm just a bunch of code running locally, but I'm ready to help you analyze some HR data!",
        "what can you do": "I can translate your natural language questions into SQL queries to analyze your employee database. You can also upload custom CSV data for me to query!"
    }
    
    # Strip punctuation for simple greeting check
    clean_q = ''.join(c for c in q_lower if c.isalnum() or c.isspace()).strip()
    if clean_q in conversational_responses:
        return {
            "reply": conversational_responses[clean_q],
            "bm25_context_used": "Conversational Intent",
            "generated_sql": "N/A"
        }
    
    tokenized_query = query.split(" ")
    doc_scores = bm25.get_scores(tokenized_query)
    best_match_idx = doc_scores.argmax() if len(doc_scores) > 0 else -1
    best_match = documents[best_match_idx] if best_match_idx != -1 else "No context found."
    
    sql = ""
    
    if "average" in q_lower or "avg" in q_lower:
        sql = "SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department;"
    elif "engineering" in q_lower:
        sql = "SELECT * FROM employees WHERE department = 'Engineering';"
    elif "salary" in q_lower and "sofia" in q_lower:
        sql = "SELECT name, salary FROM employees WHERE name LIKE '%Sofia%';"
    elif "count" in q_lower or "how many" in q_lower:
        sql = "SELECT department, COUNT(*) as count FROM employees GROUP BY department;"
    elif "all" in q_lower or "everyone" in q_lower:
        sql = "SELECT * FROM employees;"
    elif "hr" in q_lower and "manager" in q_lower:
        sql = "SELECT * FROM employees WHERE department = 'HR' AND role LIKE '%Manager%';"
    elif "highest" in q_lower or "max" in q_lower:
        sql = "SELECT * FROM employees ORDER BY salary DESC LIMIT 1;"
    else:
        # If it doesn't clearly map to SQL intent, default to a polite error
        if len(query.split()) < 3:
            return {
                "reply": "I'm not quite sure what you mean. Could you ask a specific question about your employees, like 'Show all employees in Sales'?",
                "bm25_context_used": "Unknown Intent",
                "generated_sql": "N/A"
            }
        sql = "SELECT * FROM employees LIMIT 5;"
        
    try:
        conn = sqlite3.connect(DB_FILE)
        df = pd.read_sql_query(sql, conn)
        conn.close()
        
        table_html = format_as_html_table(df)
        reply = f"Here is the requested data:<br>{table_html}"
    except Exception as e:
        reply = f"I tried to run SQL for that, but encountered an error: {e}"
        sql = "N/A"
        
    return {
        "reply": reply,
        "bm25_context_used": best_match,
        "generated_sql": sql
    }

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        # Try to parse CSV or fallback to just basic text extraction
        # If it's a CSV, we load into pandas
        try:
            import io
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
            
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            
            inserted = 0
            for _, row in df.iterrows():
                # Assuming CSV might have Name, Department, Role, Salary
                name = row.get('Name', f"Unknown {inserted}")
                dept = row.get('Department', 'General')
                role = row.get('Role', 'Employee')
                salary = row.get('Salary', 0)
                
                try:
                    c.execute('INSERT INTO employees (name, department, role, salary) VALUES (?,?,?,?)', 
                              (name, dept, role, salary))
                    inserted += 1
                except sqlite3.IntegrityError:
                    # Duplicate name ignored
                    pass
            
            conn.commit()
            conn.close()
            return {"message": f"Successfully processed {file.filename}. Inserted {inserted} new employees (duplicates skipped)."}
        except Exception as e:
            return {"message": f"File read successfully, but couldn't parse as employee CSV. Error: {e}"}
            
    except Exception as e:
        return {"error": str(e)}

from fastapi.responses import Response

@app.get("/export")
def export_data():
    try:
        conn = sqlite3.connect(DB_FILE)
        df = pd.read_sql_query("SELECT * FROM employees;", conn)
        conn.close()
        
        csv_data = df.to_csv(index=False)
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=employees_export.csv"}
        )
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
