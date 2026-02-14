---
description: Master registry of all predefined components, utilities, and imports — ALWAYS check here before creating anything new
---

# Component & Utility Registry

> **RULE**: Before creating ANY new component or utility, check this registry first.
> If it already exists here, **USE IT** — do not duplicate.

## Shadcn UI Components

All located in `src/components/shadcn-ui/`. Import with `@/components/shadcn-ui/<name>`.

| Component     | Import Path                            | Key Exports                                                                                                                                                                              |
| ------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alert         | `@/components/shadcn-ui/alert`         | `Alert`, `AlertTitle`, `AlertDescription`                                                                                                                                                |
| Avatar        | `@/components/shadcn-ui/avatar`        | `Avatar`, `AvatarImage`, `AvatarFallback`                                                                                                                                                |
| Badge         | `@/components/shadcn-ui/badge`         | `Badge`, `badgeVariants`                                                                                                                                                                 |
| Button        | `@/components/shadcn-ui/button`        | `Button`, `buttonVariants` — **variants**: `default`, `success`, `destructive`, `outline`, `secondary`, `ghost`, `link` — **sizes**: `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg` |
| Calendar      | `@/components/shadcn-ui/calendar`      | `Calendar` (uses `react-day-picker`)                                                                                                                                                     |
| Card          | `@/components/shadcn-ui/card`          | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`                                                                                                        |
| Checkbox      | `@/components/shadcn-ui/checkbox`      | `Checkbox`                                                                                                                                                                               |
| Dialog        | `@/components/shadcn-ui/dialog`        | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose` — supports `showCloseButton` prop                          |
| Drawer        | `@/components/shadcn-ui/drawer`        | `Drawer`, `DrawerTrigger`, `DrawerContent`, `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerFooter`, `DrawerClose` (uses `vaul`)                                              |
| Dropdown Menu | `@/components/shadcn-ui/dropdown-menu` | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuLabel`, `DropdownMenuGroup`                                      |
| Form          | `@/components/shadcn-ui/form`          | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` (wraps `react-hook-form`)                                                                  |
| Input         | `@/components/shadcn-ui/input`         | `Input`                                                                                                                                                                                  |
| Label         | `@/components/shadcn-ui/label`         | `Label`                                                                                                                                                                                  |
| Popover       | `@/components/shadcn-ui/popover`       | `Popover`, `PopoverTrigger`, `PopoverContent`                                                                                                                                            |
| Scroll Area   | `@/components/shadcn-ui/scroll-area`   | `ScrollArea`, `ScrollBar`                                                                                                                                                                |
| Select        | `@/components/shadcn-ui/select`        | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`, `SelectGroup`, `SelectLabel`                                                                                    |
| Separator     | `@/components/shadcn-ui/separator`     | `Separator`                                                                                                                                                                              |
| Sheet         | `@/components/shadcn-ui/sheet`         | `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`, `SheetClose`                                                                    |
| Sidebar       | `@/components/shadcn-ui/sidebar`       | `SidebarProvider`, `Sidebar`, `SidebarContent`, `SidebarGroup`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarTrigger`, etc.                                            |
| Skeleton      | `@/components/shadcn-ui/skeleton`      | `Skeleton`                                                                                                                                                                               |
| Sonner        | `@/components/shadcn-ui/sonner`        | `Toaster` (toast notifications)                                                                                                                                                          |
| Table         | `@/components/shadcn-ui/table`         | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`, `TableFooter`                                                                                 |
| Tabs          | `@/components/shadcn-ui/tabs`          | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`                                                                                                                                         |
| Textarea      | `@/components/shadcn-ui/textarea`      | `Textarea`                                                                                                                                                                               |
| Tooltip       | `@/components/shadcn-ui/tooltip`       | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`                                                                                                                         |

---

## Shared Components

All located in `src/components/shared/`. Import with `@/components/shared/<name>`.

| Component                  | Import                                         | Props                                                                                                                                                         | Purpose                                              |
| -------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `AvatarButton`             | `@/components/shared/AvatarButton`             | `src`, `fallback`, `onClick`                                                                                                                                  | User avatar with click handler                       |
| `BackButton`               | `@/components/shared/BackButton`               | —                                                                                                                                                             | Router `history.back()` with outline button          |
| `DataTable`                | `@/components/shared/DataTable`                | `columns`, `data`, `searchValue`, `onSearchChange`, `searchPlaceholder`, `sideComponent`, `pageCount`, `pagination`, `onPaginationChange`, `manualPagination` | Generic data table with sort, search, pagination     |
| `DataTableColumnHeader`    | `@/components/shared/DataTableColumnHeader`    | `column`, `title`                                                                                                                                             | Sortable column header with asc/desc/hide dropdown   |
| `DataTablePagination`      | `@/components/shared/DataTablePagination`      | `table`                                                                                                                                                       | Page size selector + first/prev/next/last navigation |
| `FormDebugger`             | `@/components/shared/FormDebugger`             | `form`                                                                                                                                                        | Dev-only: shows form state as JSON                   |
| `LoadingComponent`         | `@/components/shared/LoadingComponent`         | —                                                                                                                                                             | Full-page skeleton loading placeholder               |
| `NotFoundComponent`        | `@/components/shared/NotFoundComponent`        | —                                                                                                                                                             | 404 page placeholder                                 |
| `PageErrorComponent`       | `@/components/shared/PageErrorComponent`       | `error: Error`                                                                                                                                                | Error display with BackButton                        |
| `PageErrorSearchComponent` | `@/components/shared/PageErrorSearchComponent` | —                                                                                                                                                             | Error display for search failures                    |
| `PreloaderAlert`           | `@/components/shared/PreloaderAlert`           | `isLoading`, `src?`, `linearBg?`                                                                                                                              | Animated overlay preloader (framer-motion)           |

---

## Layout Components

All located in `src/components/layouts/`. Import with `@/components/layouts/<name>`.

| Component       | Import                               | Purpose                                                                                        |
| --------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `Breadcrumbs`   | `@/components/layouts/Breadcrumbs`   | Auto-generates breadcrumbs from route `staticData.breadcrumb` or accepts explicit `items` prop |
| `MainLayout`    | `@/components/layouts/MainLayout`    | Root layout wrapper                                                                            |
| `NavHeader`     | `@/components/layouts/NavHeader`     | Page header with `title`, `description`, and integrated `Breadcrumbs`                          |
| `PrivateLayout` | `@/components/layouts/PrivateLayout` | Authenticated layout with sidebar, header, breadcrumbs, avatar                                 |
| `PublicLayout`  | `@/components/layouts/PublicLayout`  | Public/unauthenticated layout                                                                  |

---

## Utility Functions

### `@/lib/utils`

| Function             | Signature                             | Purpose                                        |
| -------------------- | ------------------------------------- | ---------------------------------------------- |
| `cn()`               | `(...inputs: ClassValue[]) => string` | Merge Tailwind classes (clsx + tailwind-merge) |
| `wait()`             | `() => Promise<void>`                 | 1s delay (dev UX simulation)                   |
| `isRouteActive()`    | `(currentPath, navPath) => boolean`   | Check if a nav item is active                  |
| `getInitials()`      | `(fullName: string) => string`        | Extract initials from name                     |
| `getBaseUrl()`       | `() => string`                        | Returns `VITE_APP_URL` or localhost            |
| `getCallbackUrl()`   | `(redirect?: string) => string`       | Auth redirect URL builder                      |
| `formatTimeTo12Hr()` | `(time: string) => string`            | Convert "HH:mm" → "hh:mm a"                    |

### `@/lib/api.client`

| Function          | Signature                                                   | Purpose                                              |
| ----------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| `apiRequest<T>()` | `(endpoint, options?) => Promise<T>`                        | Fetch with credentials, JSON headers, error handling |
| `fetchList<T>()`  | `(endpoint, options?) => Promise<{data: T, total: number}>` | Paginated list fetch (reads `X-Total-Count` header)  |

### `@/lib/auth`

| Export       | Purpose                                             |
| ------------ | --------------------------------------------------- |
| `authClient` | Better-auth client instance                         |
| `useSession` | Hook: returns `{ data: session, isPending, error }` |

---

## Icons

Use `lucide-react` for all icons. Import from `lucide-react`.

```tsx
import { ArrowLeft, Plus, Loader2, Search, Trash2 } from "lucide-react";
```

---

## Confirmation Dialogs

Use `sweetalert2` for confirmation and success/error feedback. Import as:

```tsx
import Swal from "sweetalert2";
```

---

## Key Libraries & Their Roles

| Library                                   | Role                               | DO NOT                                                          |
| ----------------------------------------- | ---------------------------------- | --------------------------------------------------------------- |
| `react-hook-form` + `@hookform/resolvers` | Form state & validation            | Don't use uncontrolled forms or manual state                    |
| `zod`                                     | Schema validation                  | Don't use `yup` or manual validation                            |
| `@tanstack/react-query`                   | Server state (queries/mutations)   | Don't use `useEffect` for data fetching                         |
| `@tanstack/react-router`                  | File-based routing                 | Don't use `react-router-dom`                                    |
| `@tanstack/react-table`                   | Table rendering & sorting          | Don't build custom table logic                                  |
| `sweetalert2`                             | Confirmation/success/error dialogs | Don't use `window.confirm()` or custom modals for confirmations |
| `sonner`                                  | Toast notifications                | Don't use `alert()` for toasts                                  |
| `framer-motion`                           | Animations                         | Don't use raw CSS animations for complex motion                 |
| `date-fns`                                | Date formatting                    | Don't use `moment.js` or raw `Date` methods                     |
| `tailwind-merge` + `clsx`                 | Class merging                      | Always use `cn()` from `@/lib/utils`                            |
