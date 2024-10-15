# Databases

Databases are used to store and query large amounts of data.
It can easily handle millions, if not even billions of rows, in case you store and query your data efficiently.
Sometimes you might not even need a database, in case you don't have a lot of data to store, or you are just aggregating data from various APIs.
It's always good to do the things as simple as possible, as it makes things easier to change later on.

One of Django's most valuable features is the ORM.
With it, you can easily query and insert data into your database, without having to learn specifics about SQL, and you can use it out of the box, as soon as you know Python.
Django also saves you from dealing with SQL Injection, and provides a solid concept for handling authentication and authorization.

There are some specific details about databases that are helpful to know about, as soon as your application scales.
If you are at the beginning of your programming career, feel free to skip those details, and enjoy building your new application.

## Core concepts

### SQL

SQL is the query language by which you can retrieve or insert data from/into the database.
I would suggest taking a look at a cheatsheet to get comfortable with it and try it out on your own.

### ACID

The term ACID describes features about databases that make them reliable.
It stands for Atomicity, Consistency, Isolation and Durability.

#### Atomicity

Databases perform their operations within a transaction.
A transaction can contain one or multiple statements, separated by semicolon `;`.
When you connect to the database and issue a select query like this one

```sql
SELECT * FROM auth_users;
```

it happens within a transaction, that is opened and closed immediately.
But you can also begin a transaction explicitly and execute several statements within the same transaction:

```sql
BEGIN TRANSACTION;
SELECT * FROM auth_users;
INSERT INTO auth_users (name, email) VALUES ('Victor', 'victor@minimalistdjango.com');
COMMIT TRANSACTION;
```

Atomicity means that if any of the statements within a transaction fails, then none of the changes made by previous statements are persisted to the database.

In django this can be achieved with the `django.db.transaction` module, for example:

```python
from django.db import transaction

with transaction.atomic():
    ...
```

One thing to keep in mind is that transactions usually lock the database, which will be discussed later in the section about Isolation,
therefore transactions in Python code should be short and not include any other computations, since they might block other processes from reading from the database.
This is also the reason why the ATOMIC_REQUESTS setting is discouraged.

#### Consistency

Consistency refers to two things:

* Consistency in data
* Consistency in reads

Consistency in data means that the data that is persisted on the disk complies with certain rules, specified by the database schema.
For example:

* An integer field stores an integer, and not a string
* The primary key of a row is unique
* Foreign key and unique constraints are respected
* etc.

Consistency in reads means that as soon as the transaction was commited, you can query the database and get back the value that you saved initially.
This might sound trivial, but in case you do a replication or sharding of your database, the results might not be consistent.


#### Isolation

Isolation levels define how transactions see changes made by other transactions.
There are five different levels of isolation, and it might be confusing since every RDBMS defines them slightly different.
But the five principles of isolation are:

* read uncommitted
* read committed
* repeatable read
* snapshot isolation
* serializable

Read uncommitted is basically no isolation, since changes made to the data in one transaction can be immediately seen by other transactions that have this isolation level.

Read committed means that only committed changes by other transactions can be seen in a transaction with this isolation level.
That means that a value in a row might change during the same transaction.

Repeatable read makes sure that the values of the row remains unchangeable by other transactions, changes done within the same transaction will be visible though.
Other transactions have to wait for it to be released before they can update the row.
If there are conflicting changes, the transaction who commits last will fail and will be rolled back.

Snapshot isolation means that all statements within a transaction will see the data as it was at the beginning of the transaction,
even if some later statements might have changed it.

Serializable isolation level is as if all transactions are executed sequentially, and if anything that would influence the outcome of the transaction,
then the transaction will be rolled back.
This is the strictest level of isolation and allows for no anomalies.

Every isolation level comes with a cost in execution, since locks need to be acquired and other transactions might have to wait for locks to be released.
There is no one size fits all solution, and these behaviours must be accounted for when building an application.

#### Durability

This means that if a transaction completed successfully, you can be sure that the changes are persisted to disk, and nothing is lost in case of a power outage.

### Data storage and indexes

The records (rows) of a table are stored in **pages**, and all the pages of a table make up **the heap** (as in a heap of clothes).
Every page has a specific size (8 kB for Postgres, 16 kB in MySQL) and can fit a finite amount of records.
Every time a new record is inserted, it is usually inserted at the end of the heap, but sometimes the Database Engine might decide to move data around in the heap, to store the rows more efficiently.
That's why a `SELECT` without an `ORDER BY` will return the rows of the table in the order they are
Every page read is an I/O (that means reading or writing to the disk), and to maximize the performance, you want as few I/Os as possible, since every I/O is very expensive for the operating system.
Therefore, keeping your rows small (i.e. not too many columns) would fit more rows on the same page, and more rows can be fetched in a single I/O.

Indexes are a way to minimize the amount of I/O operations required to search for specific values in your table.
They are usually a B+Tree data structure, that stores the values of certain columns in an easily searchable order.
Indexes can only be created on columns with unique values.
When you find the value you are looking for, the database knows exactly where to look for in the heap and gets the exact page where the row is stored.
If you would not have an index, the database would have to go through all the pages to find the row you are looking for, and this could be a lot of I/Os.

Combined indexes are indexes created on two or more columns.
They are useful when multiple columns are often queried together.

Covered indexes are indexes where the value of other columns are additionally stored in the index, so the database does not have to go to the heap to search for that value.
Covered values do not provide any performance improvement when querying for them, unlike combined indexes, but might save some I/Os if you are often interested in the value of that column.

Indexes also don't come for free.
The size of the index must be kept in mind and should be able to fit in memory, otherwise searching the index will be slow.
Also, inserts are affected by indexes and will be slower, since with every insert the B-Tree must be updated to fit in the new value.
Understanding how I/O affects your query performance and knowing how to reduce it with the help of indexes is key to a good database design.

## Scaling

Databases are capable of handling billions of rows, and if the queries are designed carefully, you can get a long way with a single database.
There are two options for scaling that involve additional hosts:

* Replication
* Sharding

But before going there, you have a few other options:

1. Check your queries and indexes: If you keep the number of columns small and set proper indexes in place, you can reduce the number of I/Os and save resources on the server
2. Use a connection pool: Every time a new TCP connection is created to execute a query on the database, some resources will have to be allocated for creating that connection.
  If you keep a certain number of connections open from your application to the database all the time, then it will save resources and time to set up the TCP connection.
3. Horizontal partitioning: In case the table grows too big, and the index does not fit in memory anymore, then you can use horizontal partitioning to split the rows based on certain criteria.
  This way you will be able to search through the index without any performance drawbacks

Now, if these three options are not enough, you can go to following solutions, in order:

1. Read replica: One server only handles writes, while one or several other servers handle reads.
  Most applications are reading from the database a lot more than they are writing.
  Therefore, separating those two operations will keep both reading and writing performant, and is quite easy to do.
2. Multi Master replication: Two or more servers handle writes and one or more servers handle reads.
  This scales the writing, but can lead to issues related to isolation that need to be handled.
3. Sharding: The data is split among several hosts and the application is aware of how the data is split, based on a hashing function.
  It comes with isolation issues and conflicts cannot be expected to be handled by the DBMS.
  There are third party tools that handle sharding for you, but sharding should still be the last resort, even though the name is pretty badass.
