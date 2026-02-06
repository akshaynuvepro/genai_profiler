# CSS to Tailwind Migration Guide

This document provides exact replacements for all custom CSS classes with Tailwind equivalents.

---

## Custom Class Replacements

### Badge Variants

#### `badge-success`
```tsx
// ❌ Before
className="badge-success"

// ✅ After
className="bg-green-100 text-green-700 border-green-300 hover:bg-green-200 transition-colors"
```

#### `badge-info`
```tsx
// ❌ Before
className="badge-info"

// ✅ After
className="bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 transition-colors"
```

#### `badge-destructive`
```tsx
// ❌ Before
className="badge-destructive"

// ✅ After
className="bg-red-100 text-red-700 border-red-300 hover:bg-red-200 transition-colors"
```

### Glow Effects

#### `glow-success`
```tsx
// ❌ Before
className="glow-success"

// ✅ After
className="shadow-lg shadow-green-500/50"
// Or for animated glow:
className="shadow-lg shadow-green-500/50 animate-pulse"
```

#### `glow-primary`
```tsx
// ❌ Before
className="glow-primary"

// ✅ After
className="shadow-lg shadow-blue-500/50"
```

### Card Variants

#### `metric-card`
```tsx
// ❌ Before
className="metric-card"

// ✅ After
className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
```

### Section Divider

#### `section-divider`
```tsx
// ❌ Before
<div className="section-divider" />

// ✅ After
<Separator className="my-12" />
// Or if you need custom styling:
<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-12" />
```

---

## Common Patterns

### Gradient Backgrounds

#### Success Gradient
```tsx
// For cards with success theme
className="bg-gradient-to-br from-success/20 to-success/5 border-success/30"

// Tailwind equivalent:
className="bg-gradient-to-br from-green-100/80 via-green-50 to-white border border-green-200"
```

#### Primary Gradient
```tsx
// For cards with primary theme
className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30"

// Tailwind equivalent:
className="bg-gradient-to-br from-blue-100/80 via-blue-50 to-white border border-blue-200"
```

#### Info Gradient
```tsx
// For cards with info theme
className="bg-gradient-to-br from-info/20 to-info/5 border-info/30"

// Tailwind equivalent:
className="bg-gradient-to-br from-cyan-100/80 via-cyan-50 to-white border border-cyan-200"
```

### Status Colors

#### Status Badges
```tsx
// Immediate Adopt (Success)
className="bg-success/20 text-success border-success/30 glow-success"
// Replace with:
className="bg-green-100 text-green-700 border border-green-300 shadow-lg shadow-green-500/30"

// Pilot Recommended (Warning)
className="bg-warning/20 text-warning border-warning/30"
// Replace with:
className="bg-yellow-100 text-yellow-700 border border-yellow-300"

// Monitor & Revisit (Muted)
className="bg-muted text-muted-foreground border-muted"
// Replace with:
className="bg-slate-100 text-slate-600 border border-slate-300"
```

---

## Component-Specific Replacements

### DashboardHeader

```tsx
// Status color function replacement
const getStatusColor = (status) => {
  switch (status) {
    case 'immediate-adopt':
      return 'bg-green-100 text-green-700 border border-green-300 shadow-lg shadow-green-500/30';
    case 'pilot-recommended':
      return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
    case 'monitor-revisit':
      return 'bg-slate-100 text-slate-600 border border-slate-300';
  }
};
```

### ExecutiveSummary

```tsx
// Accent color classes replacement
const colorClasses = {
  success: 'bg-gradient-to-br from-green-100/80 via-green-50 to-white border border-green-200',
  primary: 'bg-gradient-to-br from-blue-100/80 via-blue-50 to-white border border-blue-200',
  info: 'bg-gradient-to-br from-cyan-100/80 via-cyan-50 to-white border border-cyan-200'
};

// Badge variants replacement
const badgeVariants = {
  success: 'bg-green-100 text-green-700 border-green-300',
  destructive: 'bg-red-100 text-red-700 border-red-300'
};
```

---

## Tailwind Config Extensions

Add these to your `tailwind.config.js` if you need custom theme values:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Map CSS variables to Tailwind colors
        success: {
          DEFAULT: 'hsl(142, 71%, 45%)',
          foreground: 'hsl(144, 61%, 20%)',
          50: 'hsl(138, 76%, 97%)',
          100: 'hsl(141, 84%, 93%)',
          200: 'hsl(141, 79%, 85%)',
          300: 'hsl(142, 77%, 73%)',
          400: 'hsl(142, 69%, 58%)',
          500: 'hsl(142, 71%, 45%)',
          600: 'hsl(142, 76%, 36%)',
          700: 'hsl(142, 72%, 29%)',
          800: 'hsl(143, 64%, 24%)',
          900: 'hsl(144, 61%, 20%)',
        },
        info: {
          DEFAULT: 'hsl(199, 89%, 48%)',
          foreground: 'hsl(204, 94%, 94%)',
          50: 'hsl(204, 100%, 97%)',
          100: 'hsl(204, 94%, 94%)',
          200: 'hsl(201, 94%, 86%)',
          300: 'hsl(199, 95%, 74%)',
          400: 'hsl(198, 93%, 60%)',
          500: 'hsl(199, 89%, 48%)',
          600: 'hsl(200, 98%, 39%)',
          700: 'hsl(201, 96%, 32%)',
          800: 'hsl(201, 90%, 27%)',
          900: 'hsl(202, 80%, 24%)',
        }
      },
      boxShadow: {
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.5)',
        'glow-primary': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-info': '0 0 20px rgba(6, 182, 212, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
```

---

## Complete Component Examples

### Example 1: MetricCard with Success Theme

```tsx
// ❌ Before (with custom classes)
<Card className={`bg-gradient-to-br ${colorClasses[accentColor]} metric-card overflow-hidden`}>
  <CardContent>
    <Badge className="badge-success">
      <TrendingUp className="h-3 w-3 mr-1" />
      +20%
    </Badge>
  </CardContent>
</Card>

// ✅ After (Tailwind only)
<Card className="bg-gradient-to-br from-green-100/80 via-green-50 to-white border border-green-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] overflow-hidden">
  <CardContent>
    <Badge className="bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 transition-colors">
      <TrendingUp className="h-3 w-3 mr-1" />
      +20%
    </Badge>
  </CardContent>
</Card>
```

### Example 2: Status Badge

```tsx
// ❌ Before
<Badge className={`${getStatusColor(status)} font-semibold px-3 py-1`}>
  IMMEDIATE ADOPT - 95% Confidence
</Badge>

// ✅ After
<Badge className="bg-green-100 text-green-700 border border-green-300 shadow-lg shadow-green-500/30 font-semibold px-3 py-1">
  IMMEDIATE ADOPT - 95% Confidence
</Badge>
```

### Example 3: Info Badge with Tooltip

```tsx
// ❌ Before
<Badge variant="outline" className="badge-info cursor-help">
  <BookOpen className="h-3 w-3 mr-1" />
  5 papers • 2,847 citations
</Badge>

// ✅ After
<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 cursor-help hover:bg-blue-100 transition-colors">
  <BookOpen className="h-3 w-3 mr-1" />
  5 papers • 2,847 citations
</Badge>
```

---

## Search & Replace Commands

Use these VS Code search/replace patterns:

### Find all custom classes:
```regex
className="[^"]*(?:badge-success|badge-info|badge-destructive|glow-success|glow-primary|metric-card|section-divider)[^"]*"
```

### Common replacements:
1. `badge-success` → `bg-green-100 text-green-700 border border-green-300`
2. `badge-info` → `bg-blue-50 text-blue-700 border-blue-300`
3. `badge-destructive` → `bg-red-100 text-red-700 border border-red-300`
4. `glow-success` → `shadow-lg shadow-green-500/30`
5. `metric-card` → `transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`

---

## Testing Checklist

After migration, test:

- [ ] All badge colors match original design
- [ ] Hover effects work correctly
- [ ] Shadows and glows appear properly
- [ ] Gradients render smoothly
- [ ] No visual regressions
- [ ] Dark mode works (if applicable)
- [ ] Responsive behavior maintained
- [ ] Animations smooth
- [ ] No custom CSS remains in codebase

---

## Files to Modify

### Delete:
- `frontend/src/App.css`

### Modify:
- `frontend/src/components/dashboard/DashboardHeader.tsx`
- `frontend/src/components/dashboard/ExecutiveSummary.tsx`
- `frontend/src/components/dashboard/ResearchDiagnostic.tsx`
- `frontend/src/components/dashboard/PaperRankingEngine.tsx`
- `frontend/src/components/dashboard/ArchitectureVisualization.tsx`
- `frontend/src/components/dashboard/CostAnalysis.tsx`
- `frontend/src/components/dashboard/QualityDeepDive.tsx`
- `frontend/src/components/dashboard/PromptOptimization.tsx`
- `frontend/src/components/dashboard/CapabilityMatrix.tsx`
- `frontend/src/components/dashboard/NextSteps.tsx`
- `frontend/src/components/dashboard/RiskAssessment.tsx`
- `frontend/src/components/dashboard/ResearchSynthesis.tsx`
- `frontend/src/pages/Index.tsx`

### Keep as-is:
- `frontend/src/index.css` (only has Tailwind base + theme variables)
- All `frontend/src/components/ui/*` files (shadcn/ui - never modify)

---

## Verification

Run these commands to verify:

```bash
# Search for custom classes
cd frontend
grep -r "badge-success\|badge-info\|badge-destructive\|glow-\|metric-card\|section-divider" src/

# Should return no results after migration

# Check for .css files (only index.css should exist)
find src -name "*.css"

# Should only show: src/index.css
```

---

**Last Updated:** 2026-02-06
**Status:** Ready for use
**Action Required:** Apply all replacements to dashboard components
