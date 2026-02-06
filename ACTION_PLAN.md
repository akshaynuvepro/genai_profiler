# Action Plan: Frontend Migration to Tailwind + shadcn/ui Only

## Current Status

✅ **Analyzed:** Complete frontend with 14 dashboard components + upload flow
✅ **Documented:** All mandatory features identified
✅ **Planned:** Migration strategy defined

❌ **Needs Work:** Custom CSS classes need replacement
❌ **Needs Cleanup:** App.css must be deleted

---

## Required Actions

### Step 1: Delete Custom CSS File
```bash
cd frontend/src
rm App.css
# Or on Windows:
del App.css
```

### Step 2: Update Imports
Remove any imports of `App.css` from components:

```tsx
// ❌ Remove these
import './App.css'
import '../App.css'
```

### Step 3: Replace Custom CSS Classes

**Files to modify** (13 files total):
- All files in `frontend/src/components/dashboard/` (13 files)
- `frontend/src/pages/Index.tsx` (1 file)

**Custom classes to replace:**
- `badge-success` → `bg-green-100 text-green-700 border border-green-300`
- `badge-info` → `bg-blue-50 text-blue-700 border-blue-300`
- `badge-destructive` → `bg-red-100 text-red-700 border border-red-300`
- `glow-success` → `shadow-lg shadow-green-500/30`
- `metric-card` → `transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`
- `section-divider` → Use `<Separator className="my-12" />` component

### Step 4: Verify Dependencies

Check that these are in `package.json`:
```bash
cd frontend
npm list framer-motion    # Should be installed
npm list mermaid          # Install if missing: npm install mermaid
```

### Step 5: Update Tailwind Config (Optional)

If you want to use custom theme colors, add to `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        success: {
          DEFAULT: 'hsl(142, 71%, 45%)',
          50: 'hsl(138, 76%, 97%)',
          100: 'hsl(141, 84%, 93%)',
          // ... see CSS_TO_TAILWIND_MIGRATION.md for full palette
        },
        info: {
          DEFAULT: 'hsl(199, 89%, 48%)',
          // ... full palette
        }
      }
    }
  }
}
```

### Step 6: Test All Features

**Critical features to test:**
- [ ] File upload with drag & drop
- [ ] Demo button loads instant report
- [ ] Progress tracking works
- [ ] Report displays with all sections
- [ ] Dashboard loads with all 14 components
- [ ] Persona switching (CTO/CFO/PM tabs)
- [ ] Forecast simulator sliders work
- [ ] Mermaid diagrams render
- [ ] All badges show correct colors
- [ ] Hover effects work
- [ ] Responsive on mobile/tablet
- [ ] No console errors

---

## Quick Reference: All Mandatory Features

### Upload Flow (App.tsx)
1. ✅ Drag & drop ZIP upload
2. ✅ Demo button for instant results
3. ✅ Progress bar with stages
4. ✅ Full report with accordions

### Dashboard (pages/Index.tsx)
1. ✅ DashboardHeader with persona tabs
2. ✅ ExecutiveSummary (3 metric cards)
3. ✅ ResearchDiagnostic (bottleneck analysis)
4. ✅ PaperRankingEngine (filterable papers)
5. ✅ ArchitectureVisualization (Mermaid diagrams)
6. ✅ CostAnalysis (ROI calculations)
7. ✅ QualityDeepDive (metric comparisons)
8. ✅ PromptOptimization (before/after prompts)
9. ✅ CapabilityMatrix (feature grid)
10. ✅ **ForecastSimulator (interactive calculator)**
11. ✅ RiskAssessment (risk matrix)
12. ✅ ResearchSynthesis (consensus/conflicts)
13. ✅ NextSteps (action items + code)
14. ✅ Section dividers between all components

---

## Verification Commands

### Find remaining custom classes:
```bash
cd frontend/src
grep -r "badge-success\|badge-info\|badge-destructive\|glow-\|metric-card\|section-divider" .
# Should return NO matches after migration
```

### Check for CSS files:
```bash
find . -name "*.css" -not -path "*/node_modules/*"
# Should only show: ./index.css
```

### Run linter:
```bash
npm run lint
# Should pass with no errors
```

### Build test:
```bash
npm run build
# Should complete successfully
```

---

## Common Issues & Solutions

### Issue: Colors don't match original
**Solution:** Use exact Tailwind colors from migration guide
```tsx
// Success theme
bg-green-100 text-green-700 border-green-300

// Primary theme
bg-blue-100 text-blue-700 border-blue-300
```

### Issue: Glows/shadows missing
**Solution:** Add shadow utilities
```tsx
className="shadow-lg shadow-green-500/30"
```

### Issue: Hover effects not working
**Solution:** Add transition classes
```tsx
className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
```

### Issue: Mermaid diagrams not rendering
**Solution:** Install mermaid and check MermaidDiagram component
```bash
npm install mermaid
```

### Issue: Section dividers missing
**Solution:** Use Separator component
```tsx
import { Separator } from '@/components/ui/separator';

<Separator className="my-12" />
```

---

## File Structure After Migration

```
frontend/src/
├── index.css ✅ (KEEP - only Tailwind + theme vars)
├── App.tsx ✅ (Upload flow)
├── main.tsx ✅
├── components/
│   ├── ui/ ✅ (shadcn/ui - NEVER modify)
│   ├── FileUpload.tsx ✅
│   ├── AnalysisProgress.tsx ✅
│   ├── ReportView.tsx ✅
│   └── dashboard/ ✅ (14 components)
├── pages/
│   └── Index.tsx ✅ (Dashboard)
├── data/
│   └── mockData.ts ✅
├── hooks/ ✅
├── types/ ✅
└── lib/ ✅
```

**Deleted:**
- ❌ App.css (DELETE THIS)

---

## Timeline Estimate

- **Step 1-2:** Delete App.css and update imports - **5 minutes**
- **Step 3:** Replace custom classes (13 files) - **1-2 hours**
- **Step 4-5:** Verify dependencies and config - **15 minutes**
- **Step 6:** Test all features - **30 minutes**

**Total:** ~2-3 hours for complete migration

---

## Success Criteria

✅ **Zero custom CSS:** No .css files except index.css
✅ **All features work:** Upload, progress, report, dashboard
✅ **All 14 dashboard components render correctly**
✅ **Persona switching works**
✅ **Interactive forecast simulator works**
✅ **Mermaid diagrams display**
✅ **Colors match design**
✅ **Hover/animations smooth**
✅ **Responsive on all devices**
✅ **No console errors**
✅ **Build succeeds**

---

## Resources

- **Feature List:** `FRONTEND_FEATURES_MANDATORY.md`
- **Migration Guide:** `CSS_TO_TAILWIND_MIGRATION.md`
- **Development Guide:** `CLAUDE.md`
- **Tailwind Docs:** https://tailwindcss.com/docs
- **shadcn/ui Docs:** https://ui.shadcn.com
- **Framer Motion:** https://www.framer.com/motion/

---

## Need Help?

If you encounter issues:

1. Check `CSS_TO_TAILWIND_MIGRATION.md` for exact class replacements
2. Verify all imports are correct
3. Check browser console for errors
4. Test on http://localhost:5173
5. Ensure backend is running on http://localhost:8000

---

**Status:** Ready to implement
**Priority:** HIGH
**Estimated Time:** 2-3 hours
**Difficulty:** Medium (mostly find/replace)

**Last Updated:** 2026-02-06
