After installing postgres, create notuno db

> https://www.postgresql.org/docs/14/tutorial-createdb.html

```
# create the db
createdb notuno
# open db repl (aka cmd line)
psql notuno
# run sql commands to add tables and constraints
\i /absolute/path/to/db.sql
```

```
# in normal command line, rollback and then run migrations
npm run rollback
npm run migrate

# screenshot output and share
```
