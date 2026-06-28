# React Hooks Plan — CarValue UAE

> All custom hooks live in `frontend/src/hooks/`.
> Read this before creating any hook in Claude Code.

---

## Hook 1: `useMakes`

**File:** `hooks/useMakes.ts`
**Purpose:** Fetch and cache the list of all car makes from the API.

```typescript
// Return type
interface UseMakesReturn {
  makes: string[];
  isLoading: boolean;
  isError: boolean;
}

// Behavior
// - Calls GET /api/v1/makes on component mount
// - Cached by TanStack Query (staleTime: Infinity — makes never change)
// - Returns sorted array of make strings
// - No refetch needed — dataset is static

// Usage
const { makes, isLoading } = useMakes();
```

---

## Hook 2: `useModels`

**File:** `hooks/useModels.ts`
**Purpose:** Fetch models for a selected car make.

```typescript
// Return type
interface UseModelsReturn {
  models: string[];
  isLoading: boolean;
  isError: boolean;
}

// Behavior
// - Takes `make: string | null` as parameter
// - Calls GET /api/v1/models?make={make} only when make is not null
// - Enabled: false when make is null (prevents premature fetch)
// - Resets when make changes (new query key)
// - Cached per make (staleTime: Infinity)

// Usage
const { models, isLoading } = useModels(selectedMake);
```

---

## Hook 3: `usePrediction`

**File:** `hooks/usePrediction.ts`
**Purpose:** Submit prediction request and return result + states.

```typescript
// Input type
interface PredictionInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  body_type: string;
  cylinders?: number;
  transmission: string;
  fuel_type: string;
  color?: string;
  location: string;
}

// Return type
interface PredictionResult {
  predicted_price: number;
  price_min: number;
  price_max: number;
  currency: string;
  confidence_note: string;
}

interface UsePredictionReturn {
  predict: (input: PredictionInput) => void;
  result: PredictionResult | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  reset: () => void;
}

// Behavior
// - Uses TanStack Query useMutation
// - Calls POST /api/v1/predict
// - On success: stores result in Zustand store + local state
// - On error: extracts error message from response
// - reset(): clears result and error state
// - Does NOT auto-submit — only fires on explicit predict() call

// Usage
const { predict, result, isLoading, isError, reset } = usePrediction();
```

---

## Hook 4: `usePriceFormatter`

**File:** `hooks/usePriceFormatter.ts`
**Purpose:** Utility hook for AED price display formatting.

```typescript
// Return type
interface UsePriceFormatterReturn {
  formatPrice: (price: number) => string;         // "AED 72,500"
  formatRange: (min: number, max: number) => string; // "AED 61,625 – AED 83,375"
  formatMileage: (km: number) => string;           // "85,000 KM"
}

// Behavior
// - Always rounds price to nearest 500 AED before display
// - Uses Intl.NumberFormat with 'en-AE' locale
// - Pure utility — no API calls, no side effects

// Usage
const { formatPrice, formatRange } = usePriceFormatter();
const display = formatPrice(72500); // → "AED 72,500"
```

---

## Hook 5: `useFormReset`

**File:** Not a separate file — integrate into PredictionForm.tsx
**Purpose:** Reset entire form + result card to initial state.

```typescript
// Behavior
// - Calls react-hook-form reset()
// - Calls usePrediction().reset()
// - Scrolls window to form section smoothly
// - Resets Model dropdown to disabled state (make cleared)

// Usage — inline in PredictionForm component
const handleReset = () => {
  formMethods.reset();
  predictionReset();
  window.scrollTo({ top: formRef.current?.offsetTop, behavior: 'smooth' });
};
```

---

## Hook Usage Map

| Component | Hooks Used |
|---|---|
| `PredictionForm.tsx` | `useMakes`, `useModels`, `usePrediction`, `usePriceFormatter` |
| `ResultCard.tsx` | `usePriceFormatter` (receives result as prop) |
| `App.tsx` / `store` | `usePrediction` result flows to Zustand |

---

## Zustand Store

**File:** `store/predictionStore.ts`

```typescript
interface PredictionStore {
  result: PredictionResult | null;
  setResult: (result: PredictionResult) => void;
  clearResult: () => void;
}

const usePredictionStore = create<PredictionStore>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null }),
}));
```

**Note:** Store is minimal. TanStack Query owns server state. Zustand only persists the prediction result between re-renders.
