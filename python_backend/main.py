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
        return "<p style='color: var(--muted-foreground)'>No data found matching your query.</p>"
    
    html = '<div style="border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-top: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">'
    html += '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">'
    html += '<thead style="background-color: var(--surface-2); text-align: left;"><tr>'
    for col in df.columns:
        html += f'<th style="padding: 10px 12px; font-weight: 600; color: var(--muted-foreground); border-bottom: 1px solid var(--border); white-space: nowrap; text-transform: capitalize;">{col}</th>'
    html += '</tr></thead><tbody>'
    
    for i, row in df.iterrows():
        bg = 'background-color: var(--surface);' if i % 2 == 0 else 'background-color: transparent;'
        html += f'<tr style="{bg}">'
        for val in row:
            if isinstance(val, (int, float)) and val > 1000:
                val = f"${val:,.0f}"
            html += f'<td style="padding: 10px 12px; border-bottom: 1px solid var(--border); white-space: nowrap; color: var(--foreground);">{val}</td>'
        html += '</tr>'
    html += '</tbody></table></div></div>'
    return html

@app.post("/copilot")
def ask_copilot(req: QueryRequest):
    query = req.text.strip()
    q_lower = query.lower()
    
    # Expanded conversational responses
    conversational_responses = {
        "hi": "Hello! I am your Nexus HRMS Copilot.",
        "hello": "Hello! How can I assist you today?",
        "hey": "Hey there! Need help querying your database?",
        "how are you": "I am functioning perfectly! Ready to help you with HR data.",
        "what can you do": "I can do basic AI assistant tasks! I can <strong>Summarize</strong> your data, <strong>Draft emails</strong>, or translate your questions into SQL queries (e.g., 'who is in engineering').",
        "who are you": "I am your AI Copilot, designed to make managing your HR data effortless.",
        "thanks": "You are very welcome!",
        "thank you": "Glad I could help!",
        "bye": "Goodbye! Have a great day!",
        "help": "Here is what I can do:<br>1. <strong>Summarize</strong>: Type 'summarize data'<br>2. <strong>Draft emails</strong>: Type 'draft an email to the engineering team'<br>3. <strong>SQL Queries</strong>: Ask questions like 'average salary by department'"
    }
    
    clean_q = ''.join(c for c in q_lower if c.isalnum() or c.isspace()).strip()
    if clean_q in conversational_responses:
        return {
            "reply": conversational_responses[clean_q],
            "bm25_context_used": "Conversational Intent",
            "generated_sql": "N/A"
        }
        
    # AI Assistant non-SQL tasks
    if 'summariz' in q_lower or 'summary' in q_lower:
        try:
            conn = sqlite3.connect(DB_FILE)
            df = pd.read_sql_query("SELECT * FROM employees;", conn)
            conn.close()
            total_emp = len(df)
            total_sal = df['salary'].sum() if not df.empty else 0
            depts = df['department'].nunique() if not df.empty else 0
            
            reply = f"""
            <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-top: 8px;">
                <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: var(--primary-strong); display: flex; align-items: center; gap: 6px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                    Database Summary
                </h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div style="background: var(--surface); padding: 12px; border-radius: 8px; border: 1px solid var(--border); text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--foreground);">{total_emp}</div>
                        <div style="font-size: 0.75rem; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.5px;">Total Employees</div>
                    </div>
                    <div style="background: var(--surface); padding: 12px; border-radius: 8px; border: 1px solid var(--border); text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--foreground);">{depts}</div>
                        <div style="font-size: 0.75rem; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.5px;">Departments</div>
                    </div>
                </div>
                <div style="margin-top: 12px; background: var(--surface); padding: 12px; border-radius: 8px; border: 1px solid var(--border); text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-teal);">${total_sal:,.0f}</div>
                    <div style="font-size: 0.75rem; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.5px;">Total Payroll Cost</div>
                </div>
            </div>
            """
            return {"reply": reply, "bm25_context_used": "AI Summarization", "generated_sql": "N/A"}
        except Exception as e:
            return {"reply": f"Error generating summary: {e}", "bm25_context_used": "AI Summarization", "generated_sql": "N/A"}

    if 'email' in q_lower and ('draft' in q_lower or 'write' in q_lower):
        reply = f"""
        <div style="margin-top: 8px;">
            <div style="font-size: 0.8rem; color: var(--muted-foreground); margin-bottom: 4px;">Draft Generated:</div>
            <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; overflow: hidden;">
                <div style="padding: 10px 14px; border-bottom: 1px solid var(--border); background: var(--surface); display: flex; align-items: center; gap: 8px;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f56;"></div>
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffbd2e;"></div>
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #27c93f;"></div>
                    <div style="margin-left: 8px; font-size: 0.8rem; color: var(--muted-foreground); font-family: monospace;">New Message</div>
                </div>
                <div style="padding: 14px; font-size: 0.85rem; line-height: 1.6; color: var(--foreground);">
                    <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed var(--border);">
                        <strong style="color: var(--muted-foreground); margin-right: 8px;">To:</strong> team@company.com<br>
                        <strong style="color: var(--muted-foreground); margin-right: 8px;">Subject:</strong> Important HR Update
                    </div>
                    Dear Team,<br><br>
                    Please be advised that we are updating our internal policies. Kindly review the latest documents attached to the employee portal.<br><br>
                    Best regards,<br>
                    <strong>HR Department</strong>
                </div>
            </div>
        </div>
        """
        return {"reply": reply, "bm25_context_used": "AI Email Generation", "generated_sql": "N/A"}

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
    elif "organis" in q_lower or "organiz" in q_lower or "sort" in q_lower or "group" in q_lower:
        sql = "SELECT * FROM employees ORDER BY department, role;"
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
