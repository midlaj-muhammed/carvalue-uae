# Market Research — CarValue UAE

## 1. Market Overview

### UAE Used Car Market
- UAE used car market valued at **USD 7.2B+** (2024), growing at ~8% YoY
- Dubai and Abu Dhabi account for ~75% of all used car transactions
- Expat population (~89% of UAE residents) drives high vehicle turnover — most residents stay 2–5 years
- No car ownership history transparency = buyers overpay or undersell consistently
- Price negotiation is culturally standard — sellers list 15–25% above expected final price

### Why Price Prediction is Valuable
- No centralized, trusted pricing authority in UAE used car market
- Existing platforms (Dubizzle, CarSwitch, YallaMotor) show listing prices — not fair market value
- Buyers have no reference point. Sellers have no anchor. Both parties guess.
- A neutral ML-based estimator fills this gap.

---

## 2. Target Users

### Primary: Private Sellers
- Individual UAE residents selling personal vehicles
- Need: "What is my car actually worth in this market?"
- Pain: Underpricing due to urgency, or no buyers due to overpricing
- Behavior: Checks 3–5 listing sites before deciding price

### Secondary: Private Buyers
- Individuals evaluating whether a listed price is fair
- Need: "Is AED 85,000 a good price for this 2018 Toyota Camry?"
- Pain: No trusted benchmark — relies on seller's word
- Behavior: Views 10–20 listings before purchasing

### Tertiary: Car Dealers (Future)
- Small dealerships needing quick inventory valuation
- Potential B2B upgrade path post-MVP

---

## 3. Competitor Analysis

| Platform | Type | Price Prediction? | UAE-Specific? | Notes |
|---|---|---|---|---|
| Dubizzle | Listing marketplace | No | Yes | Largest UAE used car platform. Shows listings, not valuations |
| CarSwitch | Certified used car dealer | Manual inspection only | Yes | Human appraisal, not instant |
| YallaMotor | Listing + editorial | No | Yes | Good SEO, no ML prediction |
| CarInfo (India) | Price estimator | Yes | No | India-only, not UAE market data |
| AutoTrader (UK) | Valuation tool | Yes | No | UK market, irrelevant pricing |
| Cars.com (US) | Valuation tool | Yes | No | US market, irrelevant pricing |

**Gap identified:** Zero UAE-specific, instant, ML-based car price estimators exist publicly.

---

## 4. Dataset Analysis

### Source
- 10,000 UAE used car listings
- Scraped/compiled from UAE automotive listing platforms
- Covers all 7 Emirates

### Dataset Quality
| Column | Type | Nulls | Notes |
|---|---|---|---|
| Make | String | 0 | 65 unique brands |
| Model | String | 0 | Varies per make |
| Year | Integer | 0 | 2005–2024 |
| Price | Integer | 0 | AED 7,183 – 14,686,980 |
| Mileage | Integer | 0 | Kilometers |
| Body Type | String | 0 | 13 types |
| Cylinders | String | 105 | Some 'Unknown' values |
| Transmission | String | 0 | Automatic / Manual |
| Fuel Type | String | 0 | Gasoline, Diesel, Hybrid, Electric |
| Color | String | 0 | — |
| Location | String | 0 | Whitespace inconsistency — needs strip() |
| Description | String | 0 | Free text — excluded from ML features |

### Price Distribution
- Mean: ~AED 245,234
- Median: ~AED 102,766
- Min: AED 7,183 (likely beaters/salvage)
- Max: AED 14,686,980 (supercars — Ferrari, Bentley, Aston Martin)
- Distribution is right-skewed — log transform recommended for model training

### Top Car Makes in Dataset
1. Mercedes-Benz (1,486 listings)
2. Nissan (925)
3. Toyota (893)
4. BMW (698)
5. Ford (541)
6. Land Rover (538)
7. Porsche (450)
8. Audi (397)
9. Jeep (345)
10. Lexus (339)

### UAE Location Coverage
All 7 Emirates present: Dubai, Abu Dhabi, Sharjah, Ajman, Al Ain, Fujeirah, Umm Al Qawain, Ras Al Khaimah

---

## 5. Key Insights for Product

1. **Luxury segment is large** — Porsche, Ferrari, Bentley present. Prediction must handle wide price range.
2. **Mercedes dominates** — 15% of dataset. Model will be most accurate for this make.
3. **Dubai + Abu Dhabi** = ~70% of listings. Location matters for pricing.
4. **Mileage in kilometers** — UAE uses metric system. Always display as KM, never miles.
5. **Automatic transmission** = ~95% of listings. Manual is rare in UAE.
6. **Electric/Hybrid segment growing** — small in dataset but must be supported.
7. **Price outliers exist** (supercar segment) — consider capping prediction confidence display for >AED 2M.

---

## 6. Recommended ML Approach

Based on dataset characteristics:
- **Algorithm:** XGBoost Regressor (handles mixed types, non-linear relationships, outliers well)
- **Target transform:** log(Price) → improves RMSE on skewed distribution
- **Expected accuracy:** R² ~0.85–0.90 based on feature richness
- **Confidence range:** ±15% of predicted price is appropriate for used car market volatility

See `data-spec.md` for full ML pipeline specification.
