---
description: Guide for creating TanStack Router pages with breadcrumbs, loaders, error/loading states, and layouts
---

This workflow defines the standard for creating new route pages.

> **PREREQUISITE**: Read `workflows/component-registry.md` first.

# Route File Location

All routes live in `src/routes/` using TanStack Router's file-based routing.

```
src/routes/
├── __root.tsx                              # Root layout
├── _authenticated.tsx                      # Auth guard + PrivateLayout wrapper
├── _authenticated/
│   ├── dashboard.tsx                       # /dashboard
│   ├── [feature].tsx                       # /[feature] (list page)
│   ├── [feature].create.tsx                # /[feature]/create
│   ├── [feature].$[feature]Id.tsx          # /[feature]/:id (detail page)
│   └── dashboard.settings.tsx              # /dashboard/settings
├── _public.tsx                             # PublicLayout wrapper
├── _public/
│   ├── index.tsx                           # / (home)
│   └── about.tsx                           # /about
└── (auth)/
    ├── _centered.tsx                       # Centered auth layout
    ├── sign-in.tsx                         # /sign-in
    └── sign-up.tsx                         # /sign-up
```

---

# Route File Naming Conventions

| Pattern           | URL                   | File Name                           |
| ----------------- | --------------------- | ----------------------------------- |
| Static            | `/users`              | `users.tsx`                         |
| Dynamic param     | `/users/:userId`      | `users.$userId.tsx`                 |
| Nested static     | `/dashboard/settings` | `dashboard.settings.tsx`            |
| Layout (pathless) | —                     | `_authenticated.tsx`, `_public.tsx` |
| Route group       | —                     | `(auth)/` folder                    |

---

# Standard Route Template

## List Page (Authenticated)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";

export const Route = createFileRoute("/_authenticated/[feature]")({
    staticData: {
        title: "[Feature]",             // Shows in PrivateLayout header
        breadcrumb: "List of [Feature]", // Shows in Breadcrumbs component
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: [Feature]Page,
});

function [Feature]Page() {
    return (
        <div>
            {/* Use NavHeader — do NOT create ad-hoc headers */}
            <NavHeader title="[Feature]" description="Manage records" />
            {/* Page content */}
        </div>
    );
}
```

## Detail Page with Loader (Dynamic Param)

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { apiRequest } from "@/lib/api.client";
import PageErrorComponent from "@/components/shared/PageErrorComponent";
import LoadingComponent from "@/components/shared/LoadingComponent";
import BackButton from "@/components/shared/BackButton";

export const Route = createFileRoute("/_authenticated/[feature]/$[feature]Id")({
    loader: async ({ params }) => {
        const item = await apiRequest(`/[feature]/${params.[feature]Id}`);
        return {
            item,
            breadcrumb: item.name, // Dynamic breadcrumb label
        };
    },
    errorComponent: ({ error }) => <PageErrorComponent error={error} />,
    pendingComponent: () => <LoadingComponent />,
    component: [Feature]DetailPage,
});

function [Feature]DetailPage() {
    const { item } = Route.useLoaderData();

    return (
        <div className="p-6 space-y-4">
            <BackButton />
            <h1 className="text-2xl font-bold">{item.name}</h1>
            {/* Detail content */}
        </div>
    );
}
```

---

# Breadcrumb System

Breadcrumbs are automatic via `staticData.breadcrumb` and `loaderData.breadcrumb`.

**Static breadcrumb** (set in route config):

```tsx
staticData: {
    breadcrumb: "List of Users",
}
```

**Dynamic breadcrumb** (set in loader return):

```tsx
loader: async ({ params }) => {
    const user = await apiRequest(`/users/${params.userId}`);
    return {
        user,
        breadcrumb: user.name, // Overrides staticData.breadcrumb
    };
},
```

---

# Required Route Properties

| Property                | Component                       | Required?                     |
| ----------------------- | ------------------------------- | ----------------------------- |
| `staticData.title`      | Shows in `PrivateLayout` header | Yes (authenticated pages)     |
| `staticData.breadcrumb` | Shows in `Breadcrumbs`          | Yes                           |
| `errorComponent`        | `PageErrorComponent`            | Yes                           |
| `pendingComponent`      | `LoadingComponent`              | Yes (if has loader)           |
| `loader`                | Data fetching                   | Only for detail/dynamic pages |

---

# Checklist

- [ ] Route file placed in correct location under `src/routes/`?
- [ ] File name follows naming convention (`$param`, `.nested`)?
- [ ] `staticData.breadcrumb` set?
- [ ] `staticData.title` set (for authenticated pages)?
- [ ] `errorComponent` uses `PageErrorComponent`?
- [ ] `pendingComponent` uses `LoadingComponent` (if loader exists)?
- [ ] Dynamic breadcrumb returned from `loader` if applicable?
- [ ] Page uses `NavHeader` for section headers?
- [ ] Detail pages include `BackButton`?
- [ ] No raw `fetch()` in loaders — uses `apiRequest` from `@/lib/api.client`?
