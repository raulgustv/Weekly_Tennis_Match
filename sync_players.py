# -*- coding: utf-8 -*-
"""ETL Tennis Weekly

MongoDB -> Postgres (Neon).
Origen: notebook de Colab, adaptado para ejecutarse en GitHub Actions.
"""

import os
import json
from datetime import datetime

import pandas as pd
from bson import ObjectId
from pymongo import MongoClient
from sqlalchemy import create_engine, text


def clean_mongo(doc):
    if isinstance(doc, list):
        return [clean_mongo(d) for d in doc]
    elif isinstance(doc, dict):
        return {k: clean_mongo(v) for k, v in doc.items()}
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, datetime):
        return doc.isoformat()
    else:
        return doc


# ---------------------------------------------------------------------------
# 1. Conexiones
# ---------------------------------------------------------------------------
MONGO_URI = os.environ.get("MONGO_URI")
NEON_URI = os.environ.get("NEON_URI")

if not MONGO_URI or not NEON_URI:
    raise Exception("Missing connection URIs")

mongo = MongoClient(MONGO_URI)
db = mongo["test"]

engine = create_engine(NEON_URI)


# ---------------------------------------------------------------------------
# 2. Leer datos
# ---------------------------------------------------------------------------
users = list(db.users.find())
matches = list(db.matches.find())

print(f"Mongo: {len(users)} users, {len(matches)} matches")

players_df = pd.DataFrame(users)
matches_df = pd.DataFrame(matches)


# ---------------------------------------------------------------------------
# 3. PLAYERS
# ---------------------------------------------------------------------------
players_df = players_df[[
    "_id", "name", "lastname", "email", "phone", "role", "ntrplvl",
    "gender", "walletBalance", "lastMatchPlayed", "isActive", "createdAt",
]]

players_df = players_df.rename(columns={
    "_id": "player_id",
    "ntrplvl": "ntrp_level",
    "walletBalance": "wallet_balance",
    "lastMatchPlayed": "last_match_played",
    "isActive": "is_active",
    "createdAt": "created_at",
})

players_df["player_id"] = players_df["player_id"].astype("str")
players_df = players_df.fillna({"wallet_balance": 0})
players_df["is_active"] = players_df["is_active"].fillna(False).astype(bool)

with engine.begin() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS players (
            player_id TEXT PRIMARY KEY,
            name TEXT,
            lastname TEXT,
            email TEXT,
            phone TEXT,
            role TEXT,
            ntrp_level FLOAT,
            gender TEXT,
            wallet_balance FLOAT,
            last_match_played TIMESTAMP,
            is_active BOOLEAN,
            created_at TIMESTAMP
        );
    """))

players_df.to_sql("players_staging", engine, if_exists="replace", index=False)

with engine.begin() as conn:
    conn.execute(text("""
        INSERT INTO players (
            player_id, name, lastname, email, phone, role,
            ntrp_level, gender, wallet_balance, last_match_played,
            is_active, created_at
        )
        SELECT
            player_id, name, lastname, email, phone, role,
            ntrp_level, gender, wallet_balance, last_match_played,
            is_active, created_at
        FROM players_staging
        ON CONFLICT (player_id)
        DO UPDATE SET
            name = EXCLUDED.name,
            lastname = EXCLUDED.lastname,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            role = EXCLUDED.role,
            ntrp_level = EXCLUDED.ntrp_level,
            gender = EXCLUDED.gender,
            wallet_balance = EXCLUDED.wallet_balance,
            last_match_played = EXCLUDED.last_match_played,
            is_active = EXCLUDED.is_active,
            created_at = EXCLUDED.created_at;
    """))

print("Players sync OK")


# ---------------------------------------------------------------------------
# 4. MATCHES
# ---------------------------------------------------------------------------
matches_df = matches_df[[
    "_id", "location", "createdBy", "maxPlayers", "startTime", "endTime",
    "paymentMethods", "price", "status", "players", "backUps", "courts",
    "createdAt",
]]

matches_df = matches_df.rename(columns={
    "_id": "match_id",
    "createdBy": "created_by",
    "maxPlayers": "max_players",
    "startTime": "start_time",
    "endTime": "end_time",
    "paymentMethods": "payment_methods",
    "backUps": "backups",
    "createdAt": "created_at",
})

# Listas / documentos anidados -> texto JSON (luego se castea a jsonb)
for col in ["players", "backups", "courts", "payment_methods"]:
    matches_df[col] = matches_df[col].apply(
        lambda x: json.dumps(clean_mongo(x)) if isinstance(x, (list, dict)) else None
    )

matches_df["match_id"] = matches_df["match_id"].astype("str")
matches_df["created_by"] = matches_df["created_by"].astype("str")
matches_df["location"] = matches_df["location"].astype("str")

with engine.begin() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS matches (
            match_id TEXT PRIMARY KEY,
            created_by TEXT,
            location TEXT,
            courts JSONB,
            max_players INTEGER,
            start_time TEXT,
            end_time TEXT,
            price FLOAT,
            payment_methods JSONB,
            status TEXT,
            players JSONB,
            backups JSONB,
            created_at TIMESTAMP
        );
    """))

matches_df.to_sql("matches_staging", engine, if_exists="replace", index=False)

with engine.begin() as conn:
    conn.execute(text("""
        INSERT INTO matches (
            match_id, created_by, location, courts, max_players,
            start_time, end_time, price, payment_methods, status,
            players, backups, created_at
        )
        SELECT
            match_id, created_by, location, courts::jsonb, max_players,
            start_time, end_time, price, payment_methods::jsonb, status,
            players::jsonb, backups::jsonb, created_at
        FROM matches_staging
        ON CONFLICT (match_id)
        DO UPDATE SET
            created_by = EXCLUDED.created_by,
            location = EXCLUDED.location,
            courts = EXCLUDED.courts,
            max_players = EXCLUDED.max_players,
            start_time = EXCLUDED.start_time,
            end_time = EXCLUDED.end_time,
            price = EXCLUDED.price,
            payment_methods = EXCLUDED.payment_methods,
            status = EXCLUDED.status,
            players = EXCLUDED.players,
            backups = EXCLUDED.backups,
            created_at = EXCLUDED.created_at;
    """))

print("Matches sync OK")

mongo.close()
