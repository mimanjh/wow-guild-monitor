# backend/data_store.py
import json
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "db.json"

def read_db():
    return json.loads(DB_PATH.read_text())

def write_db(data):
    DB_PATH.write_text(json.dumps(data, indent=2))
