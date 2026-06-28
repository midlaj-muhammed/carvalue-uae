# BRD — Business Requirements Document
## CarValue UAE — Used Car Price Prediction Platform

**Version:** 1.0
**Status:** Approved for Development
**Owner:** Product Team

---

## 1. Business Objective

Build a web application that predicts the fair market value of used cars in the UAE using machine learning. Users input car details and receive an instant estimated price in AED.

**Problem being solved:** UAE used car buyers and sellers have no neutral, data-driven pricing reference. All existing platforms show listing prices (what sellers want), not market value (what the car is worth).

---

## 2. Stakeholders

| Role | Responsibility |
|---|---|
| Product Owner | Defines scope, accepts deliverables |
| Developer (Midu) | Full-stack + ML development |
| End Users | Private sellers, buyers, dealers |

---

## 3. Business Requirements

### BR-01: Instant Price Prediction
The system must accept car attributes and return an estimated market value within 2 seconds.

### BR-02: UAE Market Accuracy
Predictions must be trained exclusively on UAE market data. International pricing models are not acceptable.

### BR-03: All UAE Emirates Supported
Location input must cover all 7 Emirates: Dubai, Abu Dhabi, Sharjah, Ajman, Al Ain, Fujeirah, Ras Al Khaimah, Umm Al Qawain.

### BR-04: Confidence Range Display
System must display a price range (min–max), not just a single number. Users must understand it is an estimate.

### BR-05: No Account Required for MVP
Price prediction must be accessible without registration. Frictionless entry.

### BR-06: Mobile Usable
Minimum 60% of UAE internet traffic is mobile. The app must be fully functional on mobile browsers.

### BR-07: Arabic/English Consideration
MVP in English only. Arabic RTL support is a post-MVP requirement.

---

## 4. Success Metrics (KPIs)

| Metric | MVP Target | 3-Month Target |
|---|---|---|
| Prediction accuracy (R²) | ≥ 0.82 | ≥ 0.87 |
| API response time | < 2 seconds | < 1 second |
| Page load time | < 3 seconds | < 2 seconds |
| Mobile usability score | > 85/100 | > 90/100 |
| Prediction form completion rate | > 70% | > 80% |

---

## 5. Business Constraints

- **Budget:** Minimal — use free tiers (Vercel, Railway free tier)
- **Timeline:** MVP delivery as soon as possible
- **Data:** Cannot use external paid data APIs — only the provided 10K dataset
- **Team:** Single developer
- **No monetization in MVP** — pure utility product

---

## 6. Business Rules

| Rule | Detail |
|---|---|
| Currency | All prices in AED only |
| Mileage unit | Kilometers only (UAE standard) |
| Year range | 2005–2024 (dataset bounds) |
| Minimum viable input | Make + Model + Year + Mileage are mandatory |
| Maximum price display | No cap — show prediction even for luxury/supercar segment |
| Disclaimer required | Must display "Estimate only. Actual price may vary based on condition and negotiation." |

---

## 7. Out of Scope (MVP)

- User authentication and accounts
- Saved prediction history
- Car comparison feature
- Dealer dashboard
- Arabic language support
- Mobile native app (iOS/Android)
- Integration with live listing platforms
- Real-time data updates to ML model

---

## 8. Future Opportunities (Post-MVP)

1. **B2B API** — sell prediction API access to dealerships
2. **Car listing integration** — detect overpriced/underpriced listings on Dubizzle
3. **Price trend graphs** — show how a car model's value changes over time
4. **Dealer dashboard** — bulk valuation tool for inventory
5. **Arabic UI** — capture non-English speaking segment
6. **WhatsApp bot** — instant valuation via WhatsApp (high UAE penetration)
