"""Upload payment method SVGs to Cloudinary and sync payment_method_config + media_asset."""
from __future__ import annotations

import os
import re
from datetime import datetime
from pathlib import Path

import cloudinary
import cloudinary.uploader
import pymysql
from dotenv import load_dotenv

ROOT = Path(r"C:\ASAK-workspace")
load_dotenv(ROOT / "ASAK-back" / ".env", override=True)

PUBLIC = ROOT / "ASAK-Admin" / "public"
FOLDER = "asak/payment"

# Local SVG → method code / display name / description / sort
# Backend PaymentMethod enum: CARD, KAKAO_PAY, NAVER_PAY, TOSS_PAY
METHODS = [
    {
        "file": PUBLIC / "samsung-pay.svg",
        "code": "CARD",
        "name": "카드 / 삼성페이 결제",
        "description": "신용 · 체크카드",
        "method_id_mock": "card",
        "sort_order": 1,
        "public_stem": "samsung-pay",
    },
    {
        "file": PUBLIC / "kakaopay.svg",
        "code": "KAKAO_PAY",
        "name": "카카오페이 결제",
        "description": "모바일 간편결제",
        "method_id_mock": "kakao",
        "sort_order": 2,
        "public_stem": "kakaopay",
    },
    {
        "file": PUBLIC / "badge_npay.svg",
        "code": "NAVER_PAY",
        "name": "네이버페이 결제",
        "description": "모바일 간편결제",
        "method_id_mock": "naver",
        "sort_order": 3,
        "public_stem": "naver-pay",
    },
    {
        "file": PUBLIC / "toss-logo.svg",
        "code": "TOSS_PAY",
        "name": "토스페이 결제",
        "description": "모바일 간편결제",
        "method_id_mock": "toss",
        "sort_order": 4,
        "public_stem": "toss-pay",
    },
]


def parse_jdbc(url: str) -> tuple[str, int, str]:
    m = re.match(r"jdbc:mysql://([^:/]+)(?::(\d+))?/([^?]+)", url or "")
    if not m:
        raise SystemExit(f"Cannot parse DB_URL: {url!r}")
    return m.group(1), int(m.group(2) or 3306), m.group(3)


def parse_cloudinary_datetime(value):
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00")).replace(tzinfo=None)


def main():
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")
    if not all([cloud_name, api_key, api_secret]):
        raise SystemExit("Missing Cloudinary credentials in ASAK-back/.env")

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True,
    )

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

    # MEDIA_PROVIDER / CLOUDINARY common_code
    cur.execute("SELECT id FROM code_group WHERE group_code = 'MEDIA_PROVIDER'")
    row = cur.fetchone()
    if not row:
        cur.execute(
            "INSERT INTO code_group (group_code, name) VALUES ('MEDIA_PROVIDER', '미디어 저장소')"
        )
        group_id = cur.lastrowid
    else:
        group_id = row[0]

    cur.execute(
        "SELECT id FROM common_code WHERE code_grp_id = %s AND code = 'CLOUDINARY'",
        (group_id,),
    )
    row = cur.fetchone()
    if not row:
        cur.execute(
            """
            INSERT INTO common_code (code_grp_id, code, name, sort_no, active)
            VALUES (%s, 'CLOUDINARY', 'Cloudinary', 1, 1)
            """,
            (group_id,),
        )
        provider_id = cur.lastrowid
    else:
        provider_id = row[0]

    # PAYMENT_METHOD code group
    cur.execute("SELECT id FROM code_group WHERE group_code = 'PAYMENT_METHOD'")
    row = cur.fetchone()
    if not row:
        cur.execute(
            "INSERT INTO code_group (group_code, name) VALUES ('PAYMENT_METHOD', '결제수단')"
        )
        pay_group_id = cur.lastrowid
    else:
        pay_group_id = row[0]

    # pay_method_cfg: media_asset FK만 사용 (URL은 media_asset.url)
    table = "pay_method_cfg"
    cur.execute(
        """
        SELECT COLUMN_NAME FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = %s
        """,
        (table,),
    )
    cols = {r[0] for r in cur.fetchall()}
    if not cols:
        raise SystemExit("pay_method_cfg table missing")

    if "image_asset_id" not in cols:
        cur.execute(
            f"ALTER TABLE {table} ADD COLUMN image_asset_id BIGINT NULL AFTER name"
        )
        print(f"added {table}.image_asset_id")
        cols.add("image_asset_id")
    if "description" not in cols:
        cur.execute(
            f"ALTER TABLE {table} ADD COLUMN description VARCHAR(100) NULL AFTER name"
        )
        print(f"added {table}.description")
        cols.add("description")
    if "icon_url" in cols:
        cur.execute(f"ALTER TABLE {table} DROP COLUMN icon_url")
        print(f"dropped {table}.icon_url (use media_asset via image_asset_id)")
        cols.discard("icon_url")

    results = []
    for item in METHODS:
        path: Path = item["file"]
        if not path.exists():
            raise SystemExit(f"Missing file: {path}")

        public_id = f"{FOLDER}/{item['public_stem']}"
        print(f"upload {path.name} → {public_id}")
        response = cloudinary.uploader.upload(
            str(path),
            resource_type="image",
            asset_folder=FOLDER,
            public_id=public_id,
            overwrite=True,
            invalidate=True,
        )
        url = response["secure_url"]

        # media_asset upsert
        cur.execute(
            """
            INSERT INTO media_asset (
                provider_id, public_id, asset_folder, url, format,
                width, height, bytes, uploaded_at
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON DUPLICATE KEY UPDATE
                asset_folder = VALUES(asset_folder),
                url = VALUES(url),
                format = VALUES(format),
                width = VALUES(width),
                height = VALUES(height),
                bytes = VALUES(bytes),
                uploaded_at = VALUES(uploaded_at),
                deleted_at = NULL
            """,
            (
                provider_id,
                response["public_id"],
                response.get("asset_folder") or FOLDER,
                url,
                response.get("format"),
                response.get("width"),
                response.get("height"),
                response.get("bytes"),
                parse_cloudinary_datetime(response.get("created_at")),
            ),
        )
        cur.execute(
            "SELECT id FROM media_asset WHERE provider_id = %s AND public_id = %s",
            (provider_id, response["public_id"]),
        )
        asset_id = cur.fetchone()[0]

        # common_code for payment method
        cur.execute(
            "SELECT id FROM common_code WHERE code_grp_id = %s AND code = %s",
            (pay_group_id, item["code"]),
        )
        code_row = cur.fetchone()
        if not code_row:
            cur.execute(
                """
                INSERT INTO common_code (code_grp_id, code, name, sort_no, active)
                VALUES (%s, %s, %s, %s, 1)
                """,
                (pay_group_id, item["code"], item["name"], item["sort_order"]),
            )
            method_code_id = cur.lastrowid
            print(f"  added common_code {item['code']} id={method_code_id}")
        else:
            method_code_id = code_row[0]
            cur.execute(
                "UPDATE common_code SET name = %s, sort_no = %s, active = 1 WHERE id = %s",
                (item["name"], item["sort_order"], method_code_id),
            )

        # pay_method_cfg upsert by method_id
        cur.execute(
            f"SELECT id FROM {table} WHERE method_id = %s",
            (method_code_id,),
        )
        cfg = cur.fetchone()
        if cfg:
            cur.execute(
                f"""
                UPDATE {table}
                SET name = %s, description = %s,
                    image_asset_id = %s, active = 1, sort_no = %s
                WHERE id = %s
                """,
                (
                    item["name"],
                    item["description"],
                    asset_id,
                    item["sort_order"],
                    cfg[0],
                ),
            )
            cfg_id = cfg[0]
        else:
            cur.execute(
                f"""
                INSERT INTO {table}
                    (method_id, name, description, image_asset_id, active, sort_no)
                VALUES (%s, %s, %s, %s, 1, %s)
                """,
                (
                    method_code_id,
                    item["name"],
                    item["description"],
                    asset_id,
                    item["sort_order"],
                ),
            )
            cfg_id = cur.lastrowid

        results.append(
            {
                "cfg_id": cfg_id,
                "code": item["code"],
                "method_id_mock": item["method_id_mock"],
                "name": item["name"],
                "description": item["description"],
                "sort_order": item["sort_order"],
                "image_asset_id": asset_id,
                "icon_url": url,
            }
        )
        print(f"  ok cfg={cfg_id} asset={asset_id} url={url}")

    conn.commit()
    cur.close()
    conn.close()

    # Write mapping for frontend mock update
    out = ROOT / "ASAK-Admin" / "scripts" / "payment-icons-cloudinary.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    import json

    out.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
