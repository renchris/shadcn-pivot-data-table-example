---
"shadcn-pivot-data-table-example": major
---

Redesign pivot workflow to start unpivoted with business context

BREAKING CHANGES:
- Scenarios now start in unpivoted view (empty rowFields/columnFields) instead of pre-configured pivots
- ClientPivotWrapper and PivotPanel components now require defaultConfig prop
- ScenarioConfig interface includes new businessValue field

NEW FEATURES:
- Unpivoted view mode displays raw data before pivoting for exploration
- Business value descriptions explain use cases for each scenario
- "IN USE" field indicators improve UX without hiding fields

BUG FIXES:
- Resolve duplicate column key errors with unique prefixes (row_, value_, pivot_, unpivoted_)
- Fix scenario config pollution when switching scenarios

DEVELOPER EXPERIENCE:
- Enable --inspect flag by default for debugging
- Add comprehensive debugging documentation
- Add VS Code launch.json configuration
- Add PIVOT-TABLE-GUIDE.md for user guidance
