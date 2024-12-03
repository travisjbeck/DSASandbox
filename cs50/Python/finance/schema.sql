SELECT symbol, 
       SUM(shares) as total_shares
FROM purchases
GROUP BY symbol
HAVING user_id = 2;



CREATE TABLE assets(
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  user_id INTEGER NOT NULL,
  symbol TEXT NOT NULL,
  shares INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);




CREATE TABLE transactions(
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  user_id INTEGER NOT NULL,
  transaction_type TEXT CHECK(transaction_type IN ('DEBIT', 'CREDIT')),
  account TEXT CHECK(account IN ('CASH', 'STOCKS')),
  qty INTEGER NOT NULL,
  price INTEGER NOT NULL,
  symbol TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE INDEX user_transactions ON transactions (user_id);
CREATE INDEX user_stock_transactions ON transactions (user_id, account);