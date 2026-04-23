#!/bin/bash
curl -s -X POST \
  "https://sdgmznktypkdjrmwkvqu.supabase.co/functions/v1/capture-thought" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZ216bmt0eXBrZGpybXdrdnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODE5NjksImV4cCI6MjA4ODA1Nzk2OX0.fLSMiHnPDHZn8eds6Myj2cady_SxwuNleQzcbHC1Q0o" \
  -H "Content-Type: application/json" \
  -d '{"content": "test thought"}'
