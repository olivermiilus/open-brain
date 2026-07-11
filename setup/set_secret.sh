#!/bin/bash
# Set Anthropic API key in Supabase secrets
# Replace YOUR_API_KEY with your actual Anthropic API key
# Get your key from: https://console.anthropic.com/

ANTHROPIC_API_KEY="YOUR_API_KEY_HERE"
PROJECT_REF="YOUR_PROJECT_REF_HERE"

supabase secrets set \
  "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" \
  --project-ref "$PROJECT_REF"
