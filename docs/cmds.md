# Useful cmds / scripts

## sequelize-auto

```
# Create models automatically
./node_modules/sequelize-auto/bin/sequelize-auto -h <host name> -d <db name> -u <db username> -x <db password> -p <port> --dialect <db type> -o <path/to/models>

# alex's seq auto
./node_modules/sequelize-auto/bin/sequelize-auto -h localhost -d notuno -u ajwc -p 5432 --dialect postgres -o models/
```

## psql

https://stackoverflow.com/questions/42653690/psql-could-not-connect-to-server-no-such-file-or-directory-5432-error/50882756

```
# start psql (ubuntu 20.04 LTS)
sudo systemctl start postgresql
```

### Create four different users where email=testuser1..2..3..4@email.com and password=password

```
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
```

UPDATE game_cards SET draw_pile='f', user_id=5 WHERE game_id=1 AND "order" = (SELECT MIN("order") FROM game_cards WHERE user_id IS NULL AND discarded='f' AND game_id=1);
select \* from game_cards where game_id=1 order by "order" asc;

SELECT \* FROM game_cards WHERE game_id=2 AND draw_pile='t' AND "order" = (SELECT MIN("order") FROM game_cards WHERE user_id IS NULL AND discarded='f');

DO $do$
BEGIN
FOR i IN 1..2 LOOP
UPDATE game_cards SET user_id=2, draw_pile='f'
WHERE game_id=1 AND "order" = (SELECT MIN("order") FROM game_cards WHERE user_id IS NULL AND draw_pile='t' AND game_id=1);
END LOOP;
END;
$do$
