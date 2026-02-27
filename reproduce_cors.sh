#!/bin/bash

# Start the server in the background
echo "Starting server..."
node server/server.js > server.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

echo "Testing CORS vulnerability..."

# Test 1: Malicious Origin
echo "--- Test 1: Request from http://evil.com ---"
response_headers=$(curl -s -I -H "Origin: http://evil.com" -X POST http://localhost:3001/api/token)
echo "$response_headers"

if echo "$response_headers" | grep -q "Access-Control-Allow-Origin: *"; then
  echo "VULNERABILITY CONFIRMED: Allowed Origin: *"
elif echo "$response_headers" | grep -q "Access-Control-Allow-Origin: http://evil.com"; then
  echo "VULNERABILITY CONFIRMED: Allowed Origin: http://evil.com"
else
  echo "SECURE: Origin http://evil.com was not reflected in Access-Control-Allow-Origin"
fi

# Test 2: Legitimate Origin
echo "--- Test 2: Request from http://localhost:5173 ---"
response_headers_legit=$(curl -s -I -H "Origin: http://localhost:5173" -X POST http://localhost:3001/api/token)
echo "$response_headers_legit"

if echo "$response_headers_legit" | grep -q "Access-Control-Allow-Origin: http://localhost:5173"; then
  echo "SUCCESS: Allowed Origin: http://localhost:5173"
elif echo "$response_headers_legit" | grep -q "Access-Control-Allow-Origin: *"; then
   echo "WARNING: Allowed Origin: * (Functionally works but insecure)"
else
  echo "FAILURE: Legitimate origin rejected"
fi

# Test 3: No Origin (Server-to-Server)
echo "--- Test 3: Request without Origin header ---"
response_headers_no_origin=$(curl -s -I -X POST http://localhost:3001/api/token)
echo "$response_headers_no_origin"
# Note: successful response might be 200 or 500 (due to upstream auth failure), but not a CORS error.
# CORS middleware doesn't block non-browser requests if configured correctly for them.
# We are checking that we didn't break normal API access.

# Cleanup
kill $SERVER_PID
