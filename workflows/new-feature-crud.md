---
description: End-to-end guide for adding a full CRUD feature spanning frontend and backend
---

This workflow is the master guide for adding a complete feature to the stack.
It references the other workflows for detailed steps.

> **PREREQUISITE**: Read `workflows/component-registry.md` first.

# Overview

Adding a new CRUD feature touches both the **NestJS backend** and **TanStack frontend**.
Follow these steps in order.

---

# Phase 1: Backend (nestjs-boiler)

Follow `docs/backend-module.md` in the `nestjs-boiler` project for detailed instructions.

## Summary of Steps

1. **Schema** — Define the Drizzle table in `src/db/schema.ts`
2. **Export** — Register the schema in `src/db/index.ts`
3. **DTOs** — Create `create-[feature].dto.ts` and `update-[feature].dto.ts` with `class-validator`
4. **Service** — CRUD operations with Drizzle ORM + audit logging
5. **Controller** — REST endpoints with `ValidationPipe`
6. **Module** — Wire up service, controller, and `AudittrailModule` import
7. **Register** — Import the module in `src/app.module.ts`
8. **Migrate** — Run `npx drizzle-kit generate` then `npx drizzle-kit migrate`

---

# Phase 2: Frontend (tanstack-vite-boiler)

## Step 1 — Schema & Types

Create `src/features/[feature]/z[Feature]Schema.ts`:

- Zod schema for form validation (see `workflows/form-development.md`)
- Response type for API responses (see `workflows/data-table-page.md`)

## Step 2 — API Layer

Create `src/features/[feature]/use-[feature].ts`:

- `queryOptions` for list fetch (using `fetchList`)
- `queryOptions` for single-item fetch (using `apiRequest`)

Create `src/features/[feature]/mutations.ts`:

- `useCreate[Feature]()` — POST mutation
- `useUpdate[Feature]()` — PATCH mutation
- `useDelete[Feature]()` — DELETE mutation
- All must invalidate `["[feature]"]` query key on success

## Step 3 — Table Columns

Create `src/features/[feature]/[feature]-columns.tsx`:

- Use `DataTableColumnHeader` for sortable columns
- Use `Badge` for status fields
- Use `Button` + `Link` for actions

## Step 4 — Form Components

Create `src/features/[feature]/Create[Feature]Form.tsx`:

- Follow `workflows/form-development.md` exactly

Create `src/features/[feature]/Edit[Feature]Form.tsx` (optional):

- Accept `initialData` prop, reuse form fields

## Step 5 — Route Pages

Create route files following `workflows/route-page.md`:

| Route  | File                                        | Component                                           |
| ------ | ------------------------------------------- | --------------------------------------------------- |
| List   | `_authenticated/[feature].tsx`              | DataTable page (see `workflows/data-table-page.md`) |
| Create | `_authenticated/[feature].create.tsx`       | Create form                                         |
| Detail | `_authenticated/[feature].$[feature]Id.tsx` | Detail view with loader                             |

All routes must include:

- `staticData.breadcrumb`
- `errorComponent` → `PageErrorComponent`
- `pendingComponent` → `LoadingComponent`

## Step 6 — Add Sidebar Link

Edit `src/components/private/AppSidebar.tsx`:

- Add a new menu item for the feature

---

# Complete File Tree

```
# Backend (nestjs-boiler)
src/db/schema.ts                              # Add table + relations
src/db/index.ts                               # Export schema
src/[feature]/dto/create-[feature].dto.ts      # Create DTO
src/[feature]/dto/update-[feature].dto.ts      # Update DTO
src/[feature]/entities/[feature].entity.ts     # Entity (optional)
src/[feature]/[feature].service.ts             # Service with CRUD + audit
src/[feature]/[feature].controller.ts          # Controller with REST
src/[feature]/[feature].module.ts              # Module
src/app.module.ts                              # Register module

# Frontend (tanstack-vite-boiler)
src/features/[feature]/z[Feature]Schema.ts     # Zod schemas + types
src/features/[feature]/use-[feature].ts        # queryOptions
src/features/[feature]/mutations.ts            # useMutation hooks
src/features/[feature]/[feature]-columns.tsx   # DataTable columns
src/features/[feature]/Create[Feature]Form.tsx # Create form
src/features/[feature]/Edit[Feature]Form.tsx   # Edit form (optional)
src/routes/_authenticated/[feature].tsx        # List page
src/routes/_authenticated/[feature].create.tsx # Create page
src/routes/_authenticated/[feature].$id.tsx    # Detail page
```

---

# Checklist

## Backend

- [ ] Drizzle table defined in `src/db/schema.ts`?
- [ ] Schema exported in `src/db/index.ts`?
- [ ] DTOs use `class-validator` decorators?
- [ ] Service uses `try/catch` with `AudittrailService.log()`?
- [ ] Controller uses `@UsePipes(new ValidationPipe(...))`?
- [ ] Module imports `AudittrailModule`?
- [ ] Module registered in `app.module.ts`?
- [ ] Migration generated and applied?

## Frontend

- [ ] Zod schema with validation messages?
- [ ] queryOptions use `fetchList`/`apiRequest`?
- [ ] Mutations invalidate correct cache keys?
- [ ] Columns use `DataTableColumnHeader`?
- [ ] Form follows `form-development.md` workflow?
- [ ] Routes have breadcrumbs, error/pending components?
- [ ] List page uses `NavHeader` + `DataTable`?
- [ ] Sidebar link added?
