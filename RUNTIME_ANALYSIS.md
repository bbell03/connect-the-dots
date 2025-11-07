# Runtime Complexity & Order Analysis

## Time Complexity (Big O Notation)

### Initialization Phase (useEffect)

#### 1. `resetLineState()`
- **Time Complexity**: O(1) - Constant time
- **Operations**: 9 ref assignments
- **Analysis**: Simple variable assignments, no loops

#### 2. `createGrid(fabricCanvas, selectedColors)`
- **Time Complexity**: O(R × C) where R = rows, C = columns
- **Current**: O(9 × 9) = **O(81)** = **O(1)** for fixed grid size
- **General**: O(n) where n = total circles
- **Operations per circle**:
  - Random color selection: O(1)
  - Circle creation: O(1)
  - Property assignment: O(1)
  - Canvas.add(): O(1) per circle
- **Total**: 81 circles × constant operations = O(81) ≈ O(1) for fixed size

#### 3. `setupEventHandlers(fabricCanvas)`
- **Time Complexity**: O(1) - Constant time
- **Operations**: 5 event handler registrations
- **Analysis**: Just registering callbacks, no execution

#### 4. `useEffect` Overall Initialization
- **Time Complexity**: O(1) for fixed grid size
- **Breakdown**:
  - Canvas setup: O(1)
  - Clear canvas: O(n) where n = existing objects (worst case)
  - Remove event listeners: O(1)
  - resetLineState(): O(1)
  - createGrid(): O(81) = O(1)
  - setupEventHandlers(): O(1)
- **Total**: O(n) where n = existing objects to clear, but typically O(1)

---

### Runtime Event Handlers

#### 1. `mouse:over` Event Handler
- **Time Complexity**: O(1) - Constant time per event
- **Operations**:
  - Type check: O(1)
  - Property set: O(1)
  - Line snapping check: O(1)
  - Validation checks: O(1) (4 simple comparisons)
  - Line creation: O(1)
  - Linked list add: O(1)
  - Canvas render: O(n) where n = total objects on canvas
- **Worst Case**: O(n) due to renderAll()
- **Average Case**: O(1) for logic, O(n) for rendering
- **Frequency**: Called every time mouse enters a circle

#### 2. `mouse:out` Event Handler
- **Time Complexity**: O(1) for logic, O(n) for rendering
- **Operations**:
  - Property set: O(1)
  - Canvas render: O(n)
- **Frequency**: Called when mouse leaves a circle

#### 3. `mouse:down` Event Handler
- **Time Complexity**: O(1) for logic, O(n) for canvas operations
- **Operations**:
  - Type check: O(1)
  - Color validation: O(1)
  - Linked list add: O(1)
  - Line creation: O(1)
  - Canvas.add(): O(1)
- **Frequency**: Called once per click

#### 4. `mouse:move` Event Handler
- **Time Complexity**: O(1) for logic, O(n) for rendering
- **Operations**:
  - Pointer calculation: O(1)
  - Line update: O(1)
  - Canvas render: O(n) - **Called very frequently!**
- **Frequency**: Called on every mouse movement (potentially 60+ times per second)
- **Performance Impact**: ⚠️ This is the most expensive operation during dragging
- **Optimization Opportunity**: Could use requestAnimationFrame to throttle renders

#### 5. `mouse:up` Event Handler
- **Time Complexity**: O(1) for logic, O(n) for canvas operations
- **Operations**:
  - Validation checks: O(1)
  - Canvas.remove(): O(1) if valid, O(n) if needs to search
- **Frequency**: Called once per mouse release

---

## Space Complexity

### Memory Usage

#### 1. Grid Storage
- **Space**: O(R × C) = O(81) = O(1) for fixed size
- **Components**:
  - Circles array: 81 Circle objects
  - Each Circle: ~200-300 bytes (Fabric.js object)
  - Total: ~16-24 KB for circles

#### 2. Line Storage
- **Space**: O(L) where L = number of lines drawn
- **Components**:
  - `allLinesRef`: Array of Line objects
  - `lineRef`: Single Line reference
  - Each Line: ~150-200 bytes
  - Worst case: O(81) if all circles connected (unlikely)

#### 3. Linked List
- **Space**: O(P) where P = path length (connected dots)
- **Components**:
  - `DoublyList`: Stores path of connected circles
  - Each node: ~50 bytes
  - Worst case: O(81) if entire path connected

#### 4. Event Handlers
- **Space**: O(1) - Fixed number of handlers
- **Components**: 5 event handler functions

#### 5. Total Space Complexity
- **Fixed Components**: O(1) - Grid, handlers, refs
- **Dynamic Components**: O(L + P) where L = lines, P = path length
- **Overall**: O(n) where n = total objects (circles + lines)
- **Typical**: ~20-30 KB for fixed grid

---

## Runtime Order (Execution Flow)

### Initial Mount/Color Scheme Change

```
1. Component renders
   └─ O(1) - React render

2. useEffect triggers
   ├─ Canvas setup: O(1)
   ├─ Clear canvas: O(n) where n = existing objects
   ├─ Remove event listeners: O(1)
   ├─ resetLineState(): O(1)
   │  └─ 9 ref assignments
   ├─ createGrid(): O(81)
   │  └─ Nested loop: 9 × 9 = 81 iterations
   │     ├─ Random color: O(1)
   │     ├─ Create Circle: O(1)
   │     ├─ Set properties: O(1)
   │     └─ Canvas.add(): O(1)
   └─ setupEventHandlers(): O(1)
      └─ Register 5 event handlers

Total: O(n) where n = objects to clear + 81 circles
```

### User Interaction Flow

#### Scenario: Drawing a Line

```
1. User clicks circle (mouse:down)
   ├─ Type check: O(1)
   ├─ Color validation: O(1)
   ├─ Linked list add: O(1)
   ├─ Create Line: O(1)
   └─ Canvas.add(): O(1)
   Total: O(1)

2. User moves mouse (mouse:move) - Called 60+ times/sec
   ├─ Check isDown: O(1)
   ├─ Get pointer: O(1)
   ├─ Update line: O(1)
   └─ Canvas.renderAll(): O(n) ⚠️ EXPENSIVE
   Total: O(n) per event × 60+ events/sec = High frequency

3. User hovers over circle (mouse:over)
   ├─ Set hover effect: O(1)
   ├─ Line snapping logic: O(1)
   ├─ Validation checks: O(1)
   ├─ Create new line (if valid): O(1)
   └─ Canvas.renderAll(): O(n)
   Total: O(n)

4. User releases mouse (mouse:up)
   ├─ Validation: O(1)
   ├─ Canvas.remove() (if invalid): O(1)
   └─ Reset state: O(1)
   Total: O(1)
```

---

## Performance Bottlenecks

### 1. **Canvas Rendering** ⚠️
- **Issue**: `renderAll()` is O(n) and called frequently
- **Impact**: 
  - mouse:move: 60+ times/sec × O(n) = High CPU usage
  - mouse:over: Every hover event
- **Solution**: 
  - Use `requestAnimationFrame` to throttle renders
  - Only render dirty regions
  - Debounce mouse:move events

### 2. **Event Handler Frequency**
- **mouse:move**: Most frequent (60+ times/sec)
- **mouse:over**: Medium frequency (depends on hover)
- **mouse:down/up**: Low frequency (user actions)

### 3. **Memory Growth**
- **Lines array**: Grows with each connection
- **Linked list**: Grows with path length
- **Mitigation**: Reset on color scheme change

---

## Optimization Recommendations

### 1. Throttle Rendering
```typescript
let renderScheduled = false;
fabricCanvas.on('mouse:move', (e) => {
    if (!renderScheduled) {
        requestAnimationFrame(() => {
            fabricCanvas.renderAll();
            renderScheduled = false;
        });
        renderScheduled = true;
    }
    // Update line position without rendering
    if (!lockLineRef.current && lineRef.current) {
        lineRef.current.set({ x2: pointer.x, y2: pointer.y });
    }
});
```

### 2. Conditional Rendering
- Only call `renderAll()` when visual changes occur
- Skip rendering if line position hasn't changed

### 3. Object Pooling
- Reuse Line objects instead of creating new ones
- Reduces garbage collection overhead

### 4. Spatial Indexing (Future)
- If grid grows large, use spatial hash for O(1) circle lookup
- Currently O(1) because grid is fixed size

---

## Summary

| Operation | Time Complexity | Space Complexity | Frequency |
|-----------|----------------|------------------|-----------|
| Initialization | O(n) | O(1) | Once |
| createGrid | O(81) = O(1) | O(81) | On color change |
| mouse:down | O(1) | O(1) | User action |
| mouse:move | O(n) | O(1) | 60+ times/sec ⚠️ |
| mouse:over | O(n) | O(1) | On hover |
| mouse:up | O(1) | O(1) | User action |
| Linked list add | O(1) | O(1) | Per connection |

**Key Insight**: The fixed 9×9 grid makes most operations O(1) in practice, but canvas rendering (O(n)) is the main performance concern, especially during mouse movement.

