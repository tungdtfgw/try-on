# US-06: Flow điều hướng sản phẩm với Pre-generation

## Mô tả
Flow điều hướng Next/Prev giữa các sản phẩm trong cùng category, với pre-generation ảnh try-on của sản phẩm tiếp theo ở background để tối ưu trải nghiệm user.

## Actors
- User (Người mua)
- Frontend (React App)
- Backend API
- Database
- Gemini AI Service (background)

## Preconditions
- User đã vào phòng thử đồ và đang xem một sản phẩm
- Có ít nhất 2 sản phẩm trong category
- User có avatar và body info

## State Management (Frontend)

### React State Structure
```javascript
{
  currentCategory: UUID,
  products: Array<Product>,  // List of products in category
  currentIndex: number,      // Current product index (0-based)
  totalCount: number,        // Total products in category
  currentTryOnImage: string, // Current displayed try-on image URL
  isLoading: boolean,        // Loading state for current product
  isPreGenerating: boolean,  // Background pre-generation state
  preGeneratedImages: Map<UUID, string>, // Cache of pre-generated images
  error: string | null
}
```

## Activity Diagram: Next Navigation

```mermaid
flowchart TD
    Start([Start]) --> A[User clicks Next button or swipes left]
    A --> B{Check debounce:<br/>300ms since<br/>last click?}
    B -->|Within window| C[Ignore click]
    C --> End1([End])
    
    B -->|Valid| D[Update last click timestamp]
    D --> E[Cancel pending pre-generation:<br/>AbortController.abort]
    E --> F[Calculate next index:<br/>currentIndex + 1 mod totalCount]
    F --> G[Update state: currentIndex = nextIndex]
    G --> H[Get next product from products list]
    
    H --> I{nextProduct.id in<br/>preGeneratedImages<br/>cache?}
    
    I -->|Yes - Cache HIT| J[Get cached image URL]
    J --> K[Display cached image immediately]
    K --> L[Update currentTryOnImage]
    L --> M[Skip loading state]
    M --> N[Update UI]
    N --> O[Trigger pre-generation for next product]
    O --> End2([End])
    
    I -->|No - Cache MISS| P[Set isLoading = true]
    P --> Q[Show loading skeleton/spinner]
    Q --> R[Call API: POST /api/tryon/generate]
    
    R --> S{API response<br/>status?}
    S -->|Error| T[Set error state]
    T --> U[Show error message with retry button]
    U --> V[Set isLoading = false]
    V --> End3([End])
    
    S -->|Success| W[Receive try-on image URL]
    W --> X[Update currentTryOnImage = image URL]
    X --> Y[Add to preGeneratedImages cache]
    Y --> Z[Set isLoading = false]
    Z --> AA[Update UI:<br/>Display image with transition,<br/>Update product info,<br/>Update position indicator]
    AA --> AB[Calculate next-next index for pre-gen]
    
    AB --> AC{Already in<br/>cache?}
    AC -->|Yes| End4([End])
    AC -->|No| AD[Start background pre-generation]
    AD --> End4
```

## Activity Diagram: Previous Navigation

```mermaid
flowchart TD
    Start([Start]) --> A[User clicks Prev button or swipes right]
    A --> B{Check debounce:<br/>300ms?}
    B -->|Within window| C[Ignore]
    C --> End1([End])
    
    B -->|Valid| D[Cancel pending pre-generation]
    D --> E[Calculate previous index:<br/>currentIndex - 1 + totalCount mod totalCount]
    E --> F[Update state: currentIndex = prevIndex]
    F --> G[Get previous product]
    
    G --> H{In pre-generated<br/>cache?}
    
    H -->|Yes| I[Display immediately]
    I --> J[Update UI with transition]
    J --> K[Trigger pre-generation for prev product]
    K --> End2([End])
    
    H -->|No| L[Set isLoading = true]
    L --> M[Call POST /api/tryon/generate]
    
    M --> N{Response<br/>status?}
    N -->|Error| O[Show error]
    O --> End3([End])
    
    N -->|Success| P[Receive image URL]
    P --> Q[Update state and cache]
    Q --> R[Set isLoading = false]
    R --> J
```

## Activity Diagram: Background Pre-generation

```mermaid
flowchart TD
    Start([Start: After displaying current product]) --> A[Wait 500ms delay]
    A --> B{User still on<br/>same product?}
    B -->|No| C[Abort]
    C --> End1([End])
    
    B -->|Yes| D[Calculate next product index:<br/>currentIndex + 1 mod totalCount]
    D --> E[Get next product ID]
    
    E --> F{nextProductId<br/>in cache?}
    F -->|Yes| G[Skip]
    G --> End2([End])
    
    F -->|No| H{Pending request<br/>exists?}
    H -->|Yes| I[Skip]
    I --> End2
    
    H -->|No| J[Set isPreGenerating = true]
    J --> K[Create new AbortController]
    K --> L[Call API: POST /api/tryon/generate<br/>with signal and priority='low']
    
    L --> M{Response<br/>status?}
    
    M -->|Aborted| N[Clean up]
    N --> O[Set isPreGenerating = false]
    O --> End3([End])
    
    M -->|API Error| P[Log error silently]
    P --> Q[Set isPreGenerating = false]
    Q --> End4([End: Silent fail])
    
    M -->|Success| R[Receive pre-generated image URL]
    R --> S{User still on<br/>same category?}
    S -->|No| T[Discard result]
    T --> End5([End])
    
    S -->|Yes| U[Add to preGeneratedImages cache:<br/>set nextProductId, imageUrl]
    U --> V[Set isPreGenerating = false]
    V --> W{Continue to<br/>next-next?}
    W -->|Optional| X[Pre-generate next-next product]
    X --> End6([End])
    W -->|No| End6
```

## Activity Diagram: Category Change

```mermaid
flowchart TD
    Start([Start]) --> A[User selects new category]
    A --> B[Cancel all pending requests:<br/>Abort current & pre-generation]
    B --> C[Clear pre-generated cache]
    C --> D[Reset state:<br/>currentIndex=0,<br/>currentTryOnImage=null,<br/>isLoading=true]
    
    D --> E[Call GET /api/tryon/products?category_id]
    E --> F{Products list<br/>empty?}
    
    F -->|Yes| G[Show 'No products' message]
    G --> End1([End])
    
    F -->|No| H[Update state:<br/>products, totalCount, currentCategory]
    H --> I[Get first product at index 0]
    I --> J[Call POST /api/tryon/generate for first product]
    
    J --> K{Response<br/>status?}
    K -->|Error| L[Show error]
    L --> End2([End])
    
    K -->|Success| M[Display first product's try-on image]
    M --> N[Update UI]
    N --> O[Trigger pre-generation for product at index 1]
    O --> End3([End])
```

## Request Cancellation Strategy

### AbortController Usage
```javascript
let currentGenerationController = null;
let preGenerationController = null;

function navigateToProduct(productId) {
  // Cancel previous generation
  if (currentGenerationController) {
    currentGenerationController.abort();
  }
  
  // Cancel pre-generation
  if (preGenerationController) {
    preGenerationController.abort();
  }
  
  // Start new generation
  currentGenerationController = new AbortController();
  
  fetch('/api/tryon/generate', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId }),
    signal: currentGenerationController.signal
  });
}
```

## UI/UX Considerations

### Loading States
1. **Initial load:** Full-screen skeleton
2. **Navigation with cache hit:** Instant transition (no loading)
3. **Navigation with cache miss:** Small spinner overlay (don't hide current image)
4. **Pre-generation:** Silent background (no UI indication)

### Transitions
- **Fade transition:** 300ms between images
- **Slide transition (optional):** Swipe animation on mobile
- **Position indicator update:** Smooth count animation

### Button States
- **Prev button:** Enabled if > 1 product (wrap around supported)
- **Next button:** Enabled if > 1 product (wrap around supported)
- **Loading button:** Show spinner inside button during generation
- **Error state:** Show retry icon in button

### Keyboard & Touch Support
- **Keyboard:** ← → arrow keys for navigation
- **Touch:** Swipe left/right on mobile (using library like react-swipeable)
- **Accessibility:** Tab navigation, ARIA labels

## Performance Optimizations

### Debouncing
```javascript
const DEBOUNCE_DELAY = 300; // ms
let lastClickTime = 0;

function handleNext() {
  const now = Date.now();
  if (now - lastClickTime < DEBOUNCE_DELAY) {
    return; // Ignore rapid clicks
  }
  lastClickTime = now;
  // Proceed with navigation
}
```

### Cache Management
- **Size limit:** Store max 10 pre-generated images in memory
- **Eviction:** Remove oldest when cache exceeds limit
- **Clear on category change:** Prevent memory bloat

### Network Optimization
- **Request priority:** Mark pre-generation as low priority
- **Parallel limit:** Max 1 pre-generation at a time
- **Retry:** Don't retry pre-generation failures (retry only on user action)

## Error Handling

### Navigation Errors
- **API Error:** Show error message with retry button
- **Network Error:** "Connection error. Please check your network."
- **Rate Limit:** "Too many requests. Please wait a moment."
- **No Image:** Auto-skip to next product or show placeholder

### Pre-generation Errors
- **Silent fail:** Don't show error to user
- **Log error:** Log to console/monitoring for debugging
- **Retry on demand:** Will regenerate when user navigates

### Edge Cases
- **Single product in category:** Disable navigation buttons
- **Last product:** Wrap to first on Next
- **First product:** Wrap to last on Prev
- **Empty category:** Show message, disable navigation

## API Endpoints Used

### GET /api/tryon/products
```
Query params: category_id
Response: {
  products: [
    { id, name, image_url, price, category_id }
  ],
  total: number
}
```

### POST /api/tryon/generate
```
Body: { product_id }
Response: {
  image_url: string,
  cached: boolean,
  product: { id, name, price, category_id }
}
```

### GET /api/tryon/products/:id/context (Optional optimization)
```
Response: {
  current: Product,
  prev_id: UUID | null,
  next_id: UUID | null,
  position: number,
  total: number
}
```

## Testing Recommendations

### Functional Tests
- Test Next navigation with cache hit/miss
- Test Prev navigation with wrap around
- Test rapid clicking (debounce)
- Test keyboard navigation
- Test touch swipe on mobile
- Test category change (cache clearing)

### Performance Tests
- Test pre-generation timing (should be background)
- Test transition smoothness (60fps)
- Test memory usage with large cache
- Test request cancellation

### Edge Case Tests
- Category with 1 product
- Category with 100+ products
- Network interruption during navigation
- API error during pre-generation
- User rapidly switching categories

### Integration Tests
- Full flow: select category → view first → navigate 5 products
- Pre-generation working correctly
- Cache being used on second pass through products
- Cleanup when switching categories
