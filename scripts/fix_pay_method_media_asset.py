"""Align pay_method_cfg with media_asset: image_asset_id only (drop icon_url)."""
from __future__ import annotations

import os
import re

import pymysql
from dotenv import load_dotenv

load_dotenv(r"C:\ASAK-workspace\ASAK-back\.env", override=True)


def parse_jdbc(url: str):
    m = re.match(r"jdbc:mysql://([^:/]+)(?::(\d+))?/([^?]+)", url or "")
    if not m:
        raise SystemExit(f"Cannot parse DB_URL: {url!r}")
    return m.group(1), int(m.group(2) or 3306), m.group(3)


def main():
    host, port, db = parse_jdbc(os.getenv("DB_URL", ""))
    conn = pymysql.connect(
        host=host,
        port=port,
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
        database=db,
        charset="utf8mb4",
        autocommit=False,
    )
    cur = conn.cursor()

    cur.execute(
        """
        SELECT COLUMN_NAME FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pay_method_cfg'
        """
    )
    cols = {r[0] for r in cur.fetchall()}
    print("cols before", sorted(cols))

    # Ensure image_asset_id exists
    if "image_asset_id" not in cols:
        cur.execute(
            "ALTER TABLE pay_method_cfg ADD COLUMN image_asset_id BIGINT NULL AFTER name"
        )
        print("added image_asset_id")

    # Backfill image_asset_id from media_asset by matching icon_url if present
    if "icon_url" in cols:
        cur.execute(
            """
            UPDATE pay_method_cfg p
            JOIN media_asset m ON m.url = p.icon_url
            SET p.image_asset_id = m.id
            WHERE p.icon_url IS NOT NULL
              AND (p.image_asset_id IS NULL OR p.image_asset_id <> m.id)
            """
        )
        print("backfilled image_asset_id from icon_url", cur.rowcount)

        cur.execute("ALTER TABLE pay_method_cfg DROP COLUMN icon_url")
        print("dropped icon_url")

    # FK if missing
    cur.execute(
        """
        SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'pay_method_cfg'
          AND CONSTRAINT_NAME = 'fk_pay_method_cfg_image_asset'
        """
    )
    if cur.fetchone() is None:
        cur.execute(
            """
            ALTER TABLE pay_method_cfg
              ADD CONSTRAINT fk_pay_method_cfg_image_asset
              FOREIGN KEY (image_asset_id) REFERENCES media_asset(id)
            """
        )
        print("added FK fk_pay_method_cfg_image_asset")

    cur.execute(
        """
        SELECT p.id, p.name, p.image_asset_id, m.public_id, m.url
        FROM pay_method_cfg p
        LEFT JOIN media_asset m ON m.id = p.image_asset_id
        ORDER BY p.sort_no
        """
    )
    for row in cur.fetchall():
        print(row)

    conn.commit()
    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
