#!/bin/sh
echo running clean up script

npm run db:rollback:all
npm run db:migrate

curl --request POST \
  --url http://localhost:3000/users/register \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --cookie connect.sid=s%253AoUn2dryNhwjuuf34YPA0sCoPHLiJrdJK.5q3tonq7EEFntwU2GgQgHxh%252BKeqPiyGRvF3rcWSkq2I \
  --data username=testuser \
  --data email=testuser@email.com \
  --data password=password \
  --data confirmPassword=password
curl --request POST \
  --url http://localhost:3000/users/register \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --cookie connect.sid=s%253AoUn2dryNhwjuuf34YPA0sCoPHLiJrdJK.5q3tonq7EEFntwU2GgQgHxh%252BKeqPiyGRvF3rcWSkq2I \
  --data username=testuser2 \
  --data email=testuser2@email.com \
  --data password=password \
  --data confirmPassword=password
curl --request POST \
  --url http://localhost:3000/users/register \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --cookie connect.sid=s%253AoUn2dryNhwjuuf34YPA0sCoPHLiJrdJK.5q3tonq7EEFntwU2GgQgHxh%252BKeqPiyGRvF3rcWSkq2I \
  --data username=testuser3 \
  --data email=testuser3@email.com \
  --data password=password \
  --data confirmPassword=password
curl --request POST \
  --url http://localhost:3000/users/register \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --cookie connect.sid=s%253AoUn2dryNhwjuuf34YPA0sCoPHLiJrdJK.5q3tonq7EEFntwU2GgQgHxh%252BKeqPiyGRvF3rcWSkq2I \
  --data username=testuser4 \
  --data email=testuser4@email.com \
  --data password=password \
  --data confirmPassword=password