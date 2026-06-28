# UX Flow — CarValue UAE

## 1. App Pages (MVP)

Single-page application. All content on `/` — no routing needed for MVP.

```
/ (Homepage)
├── Section 1: Hero
├── Section 2: How It Works
├── Section 3: Prediction Form
├── Section 4: Result Card (conditional — shown after submit)
└── Section 5: Footer
```

---

## 2. User Journey

```
ENTRY
  │
  ▼
User lands on homepage
  │
  ▼
Reads hero: "Find out what your car is worth in the UAE"
  │
  ▼
Scrolls or clicks CTA → jumps to form
  │
  ▼
┌─────────────────────────────────┐
│         PREDICTION FORM         │
│                                 │
│  Step A: Select Make (dropdown) │
│  Step B: Select Model (loads    │
│          after make selected)   │
│  Step C: Fill remaining fields  │
│  Step D: Click "Get Estimate"   │
└──────────────┬──────────────────┘
               │
               ▼
       [Validation check]
       /              \
   Fails              Passes
     │                  │
     ▼                  ▼
Field errors        Loading state
shown inline        (skeleton card
                     + button text
                     "Calculating...")
                        │
                        ▼
                   API call (POST /predict)
                   /                    \
                Error                 Success
                  │                      │
                  ▼                      ▼
            Error card            Result card slides in
            "Try again"
                        │
                        ▼
                User sees:
                - Predicted price (large)
                - Min – Max range
                - "Based on similar cars in UAE market"
                - Disclaimer
                - "Try Different Car" button
                        │
                        ▼
               User clicks "Try Different Car"
                        │
                        ▼
                Form resets → journey repeats
```

---

## 3. Section-by-Section Wireframe Description

### Section 1: Hero
```
┌─────────────────────────────────────────────────┐
│  [Logo]                              [About]     │  ← Header (sticky)
├─────────────────────────────────────────────────┤
│                                                  │
│    UAE's Smartest                                │
│    Used Car Valuator          [Car illustration] │
│                                                  │
│    Enter your car details and get an instant     │
│    AI-powered price estimate in AED.             │
│                                                  │
│         [ Get My Car's Value ↓ ]                 │  ← CTA scrolls to form
│                                                  │
└─────────────────────────────────────────────────┘
```

### Section 2: How It Works
```
┌─────────────────────────────────────────────────┐
│             How It Works                         │
│                                                  │
│  [1]              [2]              [3]           │
│  Enter your    Our AI analyzes   Get your        │
│  car details   10,000 UAE        estimate        │
│                listings          in seconds      │
└─────────────────────────────────────────────────┘
```

### Section 3: Prediction Form
```
┌─────────────────────────────────────────────────┐
│            Get Your Car's Value                  │
│                                                  │
│  Make *          [Toyota ▼]                      │
│  Model *         [Camry ▼]   ← enabled after make│
│  Year *          [2018 ▼]                        │
│  Mileage (KM) *  [85,000    ]                    │
│                                                  │
│  Body Type *     [Sedan ▼]                       │
│  Cylinders       [4 ▼]                           │
│  Transmission *  [Automatic ▼]                   │
│  Fuel Type *     [Gasoline ▼]                    │
│                                                  │
│  Color           [Black ▼]                       │
│  Location *      [Dubai ▼]                       │
│                                                  │
│        [ Get Estimate ]                          │
└─────────────────────────────────────────────────┘
```

### Section 4: Result Card (Success)
```
┌─────────────────────────────────────────────────┐
│  ✓  Your Car Estimate                            │
│                                                  │
│        AED 72,500                                │  ← Large, bold
│                                                  │
│   Range: AED 61,625 – AED 83,375                 │
│   Based on similar cars in UAE market                 │
│                                                  │
│  ⚠ This is an AI-generated estimate. Actual      │
│    price depends on condition and negotiation.   │
│                                                  │
│  [ Try Different Car ]   [ Share Result ]        │
└─────────────────────────────────────────────────┘
```

### Section 4: Result Card (Error)
```
┌─────────────────────────────────────────────────┐
│  ✕  Something went wrong                         │
│                                                  │
│     Unable to calculate estimate.                │
│     Please check your inputs and try again.      │
│                                                  │
│              [ Try Again ]                       │
└─────────────────────────────────────────────────┘
```

### Section 4: Result Card (Loading)
```
┌─────────────────────────────────────────────────┐
│  ████████████████████                            │  ← Skeleton
│  ████████████                                    │
│  ████████████████████████████                    │
│  ████████████████                                │
└─────────────────────────────────────────────────┘
```

---

## 4. Mobile Layout (375px)

All sections stack vertically. Form fields go full width. Result card is full width below form. No horizontal scrolling.

```
[Header: Logo only on mobile]

[Hero: Text centered, no illustration]

[How It Works: 1 column stack]

[Form: Full width fields]

[Result Card: Full width]

[Footer: Minimal]
```

---

## 5. Interaction States

| Element | Default | Hover | Focused | Disabled | Error |
|---|---|---|---|---|---|
| Dropdown | Border gray | Border blue | Border blue + ring | Opacity 50% gray | Border red |
| Number input | Border gray | Border blue | Border blue + ring | Opacity 50% | Border red |
| Submit button | Blue filled | Darker blue | — | Gray + spinner | — |
| Model dropdown | Grayed out | — | — | Until make selected | — |

---

## 6. Form Validation Rules

| Field | Rule | Error Message |
|---|---|---|
| Make | Required | "Please select a car make" |
| Model | Required | "Please select a model" |
| Year | Required | "Please select a year" |
| Mileage | Required, min 0, max 999999 | "Please enter a valid mileage" |
| Body Type | Required | "Please select a body type" |
| Transmission | Required | "Please select transmission type" |
| Fuel Type | Required | "Please select fuel type" |
| Location | Required | "Please select your emirate" |
