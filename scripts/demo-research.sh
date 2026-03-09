#!/bin/bash
set -e
API=http://localhost:4000
TOKEN=$(curl -s -X POST $API/auth/login -H "Content-Type:application/json" -d '{"email":"demo@local","password":"demo"}' | jq -r .access_token)
THREAD_ID=$(curl -s -X POST $API/threads -H "Authorization: Bearer $TOKEN" -H "Content-Type:application/json" -d '{"title":"HDFC valuation", "userId":"demo"}' | jq -r .id)
# start research
RESP=$(curl -s -X POST $API/agent/research -H "Authorization: Bearer $TOKEN" -H "Content-Type:application/json" -d "{\"query\":\"Is HDFC Bank undervalued vs peers in last 2 quarters?\",\"user_id\":\"demo\",\"thread_id\":\"$THREAD_ID\"}")
SESSION=$(echo $RESP | jq -r .session)
# tail SSE until done (simple)
curl -s $API/agent/stream/$SESSION | while read line ; do echo $line; done
# after completion, fetch export
curl -H "Authorization: Bearer $TOKEN" "$API/threads/$THREAD_ID/export?format=md" -o hdfc_report.md
echo "Report saved to hdfc_report.md"
