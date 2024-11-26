-- Keep a log of any SQL queries you execute as you solve the mystery.
--Took place on July 28, 2023
--Lets get info from crime scene reports for that day
SELECT
  *
FROM
  crime_scene_reports
WHERE
  year = 2023
  AND month = 7
  AND day = 28;

--Crime scene report says: Theft of the CS50 duck took place at 10:15am at the Humphrey Street bakery.
--Interviews were conducted today with three witnesses who were present at the time – each of their interview transcripts mentions the bakery.
--Lets look at these interviews
SELECT
  *
FROM
  interviews
WHERE
  year = 2023
  AND month = 7
  AND day = 28
  AND transcript LIKE '%bakery%';

-- Ruth: Sometime within ten minutes of the theft, I saw the thief get into a car in the bakery parking lot and drive away. If you have security footage from the bakery parking lot, you might want to look for cars that left the parking lot in that time frame.

-- Get logs for July 28, 2023 in between 10:15 am and 10:25 am
SELECT *
FROM bakery_security_logs
WHERE year = 2023
AND month = 7
AND day = 28
AND hour = 10
AND minute > 15
AND minute < 25;

--Possible license plates:
-- +-----+------+-------+-----+------+--------+----------+---------------+
-- | id  | year | month | day | hour | minute | activity | license_plate |
-- +-----+------+-------+-----+------+--------+----------+---------------+
-- | 260 | 2023 | 7     | 28  | 10   | 16     | exit     | 5P2BI95       |
-- | 261 | 2023 | 7     | 28  | 10   | 18     | exit     | 94KL13X       |
-- | 262 | 2023 | 7     | 28  | 10   | 18     | exit     | 6P58WS2       |
-- | 263 | 2023 | 7     | 28  | 10   | 19     | exit     | 4328GD8       |
-- | 264 | 2023 | 7     | 28  | 10   | 20     | exit     | G412CB7       |
-- | 265 | 2023 | 7     | 28  | 10   | 21     | exit     | L93JTIZ       |
-- | 266 | 2023 | 7     | 28  | 10   | 23     | exit     | 322W7JE       |
-- | 267 | 2023 | 7     | 28  | 10   | 23     | exit     | 0NTHK55       |
-- +-----+------+-------+-----+------+--------+----------+---------------+


--Eugene: I don't know the thief's name, but it was someone I recognized. Earlier this morning, before I arrived at Emma's bakery, I was walking by the ATM on Leggett Street and saw the thief there withdrawing some money.
--Lets look at the bank records for that day on Leggett Street
-- get the bank records, then the person id from the account number

SELECT person_id
FROM bank_accounts
WHERE account_number IN (
  SELECT account_number
  FROM
  atm_transactions
  WHERE atm_location = 'Leggett Street'
  AND year = 2023
  AND month = 7
  AND day = 28
  AND transaction_type = 'withdraw'
);

--lots of data there, nothing concrete, we may be able to cross reference with the license plates, but lets try the next one first


--Raymond: As the thief was leaving the bakery, they called someone who talked to them for less than a minute. In the call, I heard the thief say that they were planning to take the earliest flight out of Fiftyville tomorrow. The thief then asked the person on the other end of the phone to purchase the flight ticket.
-- OK, so lets find the passengers for the earliest flight leaving fiftyville early tomorrow morning
-- get the airport id for fiftyville
-- get the earliest flight tomorrow originating from fiftyville
-- get the passengers for that flight
-- get the people for those passengers



SELECT passport_number
FROM passengers
WHERE flight_id = (
  SELECT id
  FROM flights
  WHERE origin_airport_id = (
    SELECT id
    FROM airports
    WHERE city = 'Fiftyville'
  )
  AND
  year = 2023
  AND month = 7
  AND day = 29
  ORDER BY hour ASC, minute ASC
  LIMIT 1
);


-- then phone calls < 60s on the 28th to any of those numbers we will narrow it down
-- and the people that made those calls

SELECT *
FROM people
WHERE phone_number IN (
  -- made a phone call that day < 60s
  SELECT caller
  FROM phone_calls
  WHERE year = 2023
  AND month = 7
  AND day = 28
  AND duration < 60
)
AND
passport_number IN (
  -- AND who's on the earliest flight tomorrow
  SELECT passport_number
  FROM passengers
  WHERE flight_id = (
    SELECT id
    FROM flights
    WHERE origin_airport_id = (
      SELECT id
      FROM airports
      WHERE city = 'Fiftyville'
    )
    AND
    year = 2023
    AND month = 7
    AND day = 29
    ORDER BY hour ASC, minute ASC
    LIMIT 1
  )
)
AND
license_plate IN (
  -- was seen leaving the bakery
  SELECT license_plate
  FROM bakery_security_logs
  WHERE year = 2023
  AND month = 7
  AND day = 28
  AND hour = 10
  AND minute > 15
  AND minute < 25
)
AND
id IN (
  --people who made withdrawals at legget street that morning
  SELECT person_id
  FROM bank_accounts
  WHERE account_number IN (
    SELECT account_number
    FROM
    atm_transactions
    WHERE atm_location = 'Leggett Street'
    AND year = 2023
    AND month = 7
    AND day = 28
    AND transaction_type = 'withdraw'
  )
);

--AND... boom goes the dynamite
-- +--------+-------+----------------+-----------------+---------------+
-- |   id   | name  |  phone_number  | passport_number | license_plate |
-- +--------+-------+----------------+-----------------+---------------+
-- | 686048 | Bruce | (367) 555-5533 | 5773159633      | 94KL13X       |
-- +--------+-------+----------------+-----------------+---------------+

-- Who was his accomplice. Who did he call, and who purchased the ticket and to where?
-- Bruce made a <60s call on the 28th to the accomplish
SELECT *
FROM people
WHERE phone_number IN (
  -- made a phone call that day < 60s
  SELECT receiver
  FROM phone_calls
  WHERE year = 2023
  AND month = 7
  AND day = 28
  AND duration < 60
  AND caller = '(367) 555-5533'
);
--+--------+-------+----------------+-----------------+---------------+
--|   id   | name  |  phone_number  | passport_number | license_plate |
--+--------+-------+----------------+-----------------+---------------+
--| 864400 | Robin | (375) 555-8161 | NULL            | 4V16VO0       |
--+--------+-------+----------------+-----------------+---------------+


--where is Bruce going?
select city
FROM airports
WHERE id = (
  SELECT destination_airport_id
  FROM flights
  WHERE id = (
    SELECT flight_id
    FROM passengers
    WHERE passport_number = 5773159633
  )
);

--+---------------+
--|     city      |
--+---------------+
--| New York City |
--+---------------+


--- ahhh.. its batman and robin.. those scoundrels...
-- Keep a log of any SQL queries you execute as you solve the mystery.

