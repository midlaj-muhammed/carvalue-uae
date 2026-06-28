"""Drift detection for CarValue UAE model predictions.

Usage:
    cd ml && python drift.py

Monitors rolling median of predicted prices per make per month.
Alerts if deviation from prior 3-month baseline exceeds 15%.
Requires prediction_logs table to have data.
"""

import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np

BASELINE_PATH = Path(__file__).parent / "benchmarks" / "baseline.json"
ALERT_THRESHOLD = 0.15  # 15% deviation triggers alert


def compute_rolling_baseline(predictions, window_months=3):
    """Compute rolling median per make over the last window_months months."""
    baseline = {}
    for make, monthly_prices in predictions.items():
        sorted_months = sorted(monthly_prices.keys(), reverse=True)
        recent = sorted_months[:window_months]
        all_prices = []
        for m in recent:
            all_prices.extend(monthly_prices[m])
        if all_prices:
            baseline[make] = np.median(all_prices)
    return baseline


def detect_drift(predictions, baseline):
    """Compare current month median against baseline. Return list of alerts."""
    alerts = []
    current_month = datetime.now().strftime("%Y-%m")

    for make, monthly_prices in predictions.items():
        if current_month not in monthly_prices or not monthly_prices[current_month]:
            continue
        current_median = np.median(monthly_prices[current_month])
        if make not in baseline or baseline[make] == 0:
            continue
        deviation = abs(current_median - baseline[make]) / baseline[make]
        if deviation > ALERT_THRESHOLD:
            direction = "UP" if current_median > baseline[make] else "DOWN"
            alerts.append({
                "make": make,
                "current_median": round(current_median),
                "baseline_median": round(baseline[make]),
                "deviation_pct": round(deviation * 100, 1),
                "direction": direction,
            })
    return alerts


def main():
    """Main drift detection entry point.

    In production, this reads from prediction_logs via SQLAlchemy.
    For MVP, this is a standalone script that can be called from CI
    or scheduled via cron.
    """
    print("=" * 60)
    print("CarValue UAE — Drift Detection")
    print("=" * 60)

    # Load prediction data from database
    # For now, check if prediction_logs has data via a simple query
    try:
        from sqlalchemy import create_engine, text
        from app.config import settings

        engine = create_engine(settings.database_url)
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT make, DATE_TRUNC('month', created_at) as month, predicted_price
                FROM prediction_logs
                WHERE created_at > NOW() - INTERVAL '6 months'
                ORDER BY created_at
            """))
            rows = result.fetchall()
    except Exception as e:
        print(f"ERROR: Cannot read prediction_logs: {e}")
        print("Drift detection requires a populated prediction_logs table.")
        sys.exit(1)

    if not rows:
        print("No prediction data found. Drift detection requires historical predictions.")
        sys.exit(0)

    # Organize by make -> month -> prices
    predictions = {}
    for make, month, price in rows:
        make = make.strip().lower()
        month_str = month.strftime("%Y-%m")
        if make not in predictions:
            predictions[make] = {}
        if month_str not in predictions[make]:
            predictions[make][month_str] = []
        predictions[make][month_str].append(price)

    # Compute rolling baseline (prior 3 months)
    baseline = compute_rolling_baseline(predictions, window_months=3)
    print(f"\nBaseline computed for {len(baseline)} makes.")

    # Detect drift
    alerts = detect_drift(predictions, baseline)

    if alerts:
        print(f"\n⚠️  DRIFT DETECTED — {len(alerts)} makes show >15% deviation:")
        print(f"{'─' * 60}")
        for a in alerts:
            print(f"  {a['make']:15s} {a['direction']:4s} "
                  f"AED {a['current_median']:>10,} vs baseline AED {a['baseline_median']:>10,} "
                  f"({a['deviation_pct']:.1f}%)")
        print(f"{'─' * 60}")
        print("\nAction required: Retrain model with updated data.")
        sys.exit(1)
    else:
        print("\n✓ No drift detected — all makes within 15% of baseline.")
        sys.exit(0)


if __name__ == "__main__":
    main()
