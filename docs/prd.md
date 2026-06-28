# PRD — Product Requirements Document
## CarValue UAE — Used Car Price Prediction Platform

**Version:** 1.0
**Status:** Ready for Development

---

## 1. Product Overview

CarValue UAE is a web application where users input their car's details (make, model, year, mileage, etc.) and receive an instant AI-predicted market price in AED, based on 10,000 real UAE car listings.

**One-line pitch:** "Know what your car is worth in the UAE market — instantly."

---

## 2. User Personas

### Persona 1 — Fahad (Seller)
- 34 years old, Dubai resident, expat (Pakistani)
- Selling his 2018 Toyota Camry after 4 years
- Doesn't know if AED 65,000 is reasonable
- Wants: quick answer, no registration, trustworthy number

### Persona 2 — Sarah (Buyer)
- 28 years old, Abu Dhabi, expat (British)
- Found a 2020 Nissan Patrol on Dubizzle for AED 145,000
- Wants to know: is this fair or overpriced?
- Wants: instant check, mobile-friendly

---

## 3. User Stories

### Core Prediction Flow
| ID | Story | Priority |
|---|---|---|
| US-01 | As a user, I want to select my car make from a dropdown so I don't have to type it manually | P0 |
| US-02 | As a user, I want the model dropdown to update based on the make I selected | P0 |
| US-03 | As a user, I want to input my car's year, mileage, body type, fuel type, transmission, cylinders, color, and location | P0 |
| US-04 | As a user, I want to click "Get Estimate" and see the predicted price in AED | P0 |
| US-05 | As a user, I want to see a price range (min–max) so I understand there's a margin of uncertainty | P0 |
| US-06 | As a user, I want to see how many similar cars were used to calculate my estimate | P1 |
| US-07 | As a user, I want to reset the form and try with different values | P0 |
| US-08 | As a user, I want to use the app on my mobile phone | P0 |
| US-09 | As a user, I want to see a loading state while the prediction is being calculated | P0 |
| US-10 | As a user, I want to see a clear error message if something goes wrong | P0 |

### Secondary Features
| ID | Story | Priority |
|---|---|---|
| US-11 | As a user, I want to see popular car makes shown prominently for quick selection | P2 |
| US-12 | As a user, I want to share my car's estimate result | P2 |
| US-13 | As a user, I want to see a disclaimer that this is an estimate | P1 |

---

## 4. Feature Specification

### Feature 1: Car Make & Model Cascading Dropdowns
- Make dropdown: loads all 65 makes from API on page load
- Model dropdown: disabled until make is selected, then fetches models for that make
- Both fields: searchable (type-ahead filter)
- Sorted alphabetically

### Feature 2: Prediction Form Fields
| Field | Type | Required | Options |
|---|---|---|---|
| Make | Dropdown | Yes | 65 makes from dataset |
| Model | Dropdown | Yes | Dynamic based on make |
| Year | Dropdown | Yes | 2005–2024 |
| Mileage | Number input | Yes | Min: 0, Max: 999,999 KM |
| Body Type | Dropdown | Yes | Sedan, SUV, Hatchback, Coupe, Crossover, Pick Up Truck, Soft Top Convertible, Hard Top Convertible, Sports Car, Van, Wagon, Utility Truck, Other |
| Cylinders | Dropdown | No | 3, 4, 5, 6, 8, 10, 12, Unknown |
| Transmission | Dropdown | Yes | Automatic, Manual |
| Fuel Type | Dropdown | Yes | Gasoline, Diesel, Hybrid, Electric |
| Color | Dropdown | No | Values from dataset |
| Location (Emirate) | Dropdown | Yes | All 7 Emirates |

### Feature 3: Result Card
- **Main display:** Predicted price (AED XXX,XXX) — large, bold
- **Range display:** "Estimated range: AED XXX,XXX – AED XXX,XXX"
- **Confidence indicator:** "Based on similar cars in UAE market"
- **Disclaimer:** "This is an AI estimate. Actual price may vary."
- **Action buttons:** "Try Different Car" | "Share Result"
- Appears below form on same page (no navigation)

### Feature 4: Error & Loading States
- **Loading:** Skeleton card replaces result area, "Calculating..." text on button
- **API error:** Red inline card — "Something went wrong. Please try again."
- **Validation error:** Field-level red text before submission
- **Out-of-range:** If prediction is unusually high/low, show note "Limited data for this combination"

---

## 5. Page Structure

```
/ (Home)
├── Hero section — tagline + CTA scroll to form
├── How It Works — 3-step explainer (icon cards)
├── Prediction Form — all fields
├── Result Card — appears after submit
└── Footer — disclaimer + about

/about (Optional, post-MVP)
/faq (Optional, post-MVP)
```

---

## 6. MVP Acceptance Criteria

- [ ] Form loads with all dropdowns populated from API
- [ ] Make → Model cascade works correctly
- [ ] Prediction returns in under 2 seconds
- [ ] Result card shows: price, range, confidence_note
- [ ] Form resets correctly
- [ ] Works on iPhone Safari and Android Chrome
- [ ] No console errors in production
- [ ] Disclaimer visible on result card
- [ ] API errors handled gracefully — no blank screens

---

## 7. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Page load (LCP) | < 2.5 seconds |
| API response | < 2 seconds |
| Mobile viewport | 375px minimum |
| Browser support | Chrome, Safari, Firefox, Edge (last 2 versions) |
| Accessibility | WCAG 2.1 AA minimum (labels, contrast, keyboard nav) |
| HTTPS | Required in production |
