from fastapi import FastAPI, HTTPException
import asyncio, os, json
import redis
from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import uuid4
from embeddings import embed_text, upsert_vectors  # wrapper to providers
from search_tools import run_searches
from crawler import fetch_and_extract
from synth import stream_synthesis  # uses OpenAI or other LLM in streaming mode

app = FastAPI()
r = redis.Redis.from_url(os.environ.get("REDIS_URL", "redis://redis:6379/0"))

class ResearchRequest(BaseModel):
    user_id: str
    thread_id: str
    query: str
    options: Dict[str, Any] = {}

@app.post("/research")
async def research(req: ResearchRequest):
    session = str(uuid4())
    # publish start event
    r.publish(f"agent:stream:{session}", json.dumps({"type":"meta","payload":{"status":"started","session":session}}))
    # 1) search
    sources = await run_searches(req.query, top_k=req.options.get("top_k", 10))
    # publish sources metadata
    r.publish(f"agent:stream:{session}", json.dumps({"type":"sources","payload":sources}))
    # 2) crawl & extract
    docs = []
    for s in sources:
        text = await fetch_and_extract(s['url'])
        docs.append({"url": s['url'], "title": s.get("title"), "text": text, "snippet": s.get("snippet")})
    # 3) dedupe (simple)
    deduped = dedupe_by_url(docs)
    # 4) embeddings & upsert
    vectors = []
    for d in deduped:
        chunks = chunk_text(d['text'])
        for c in chunks:
            vec = embed_text(c)
            vectors.append({"id": str(uuid4()), "vector": vec, "metadata": {"url": d['url']}})
    upsert_vectors(vectors)
    # 5) run synth with streaming tokens
    async for event in stream_synthesis(req.query, deduped, stream=True):
        # event = {"type":"token"|"thinking"|"done", "payload": ...}
        r.publish(f"agent:stream:{session}", json.dumps(event))
    # 6) final report saved into Postgres by backend (call backend API)
    return {"session": session}
