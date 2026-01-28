# Workflow Rule: Form and API Interaction

---

## description:

This rule is designed to provide a general framework for working with forms and API interactions. As always, review and adapt the code snippets provided to fit your specific use case.

# Tools and Libraries: Use the following tools and libraries:

TypeScript
React
@tanstack/react-query
Shadcn UI (for UI components)
@hookform/resolvers/zod (for form validation)
react-hook-form (for form management)

# Form Components:

Use the Form component from Shadcn UI to wrap form elements
Create form fields using the FormField component (e.g., name, email, password)
Use the FormControl component to render input fields and handle user input

# API Interaction:

When interacting with APIs, use the apiRequest function from @lib/api.client.ts
This function handles API requests and returns a promise that resolves to the response data

# Querying Data:

When querying data, use the useQuery hook from @tanstack/react-query
Pass the query options and API request data to the useQuery hook

# Form Interaction:

When interacting with forms, use the useForm hook from React Hook Form
Validate form data using Zod schemas (e.g., in
sign-up.tsx
)

# API Request Caching:

Use the queryOptions function from @tanstack/react-query to cache API requests
Pass the query options and API request data to the useQuery hook
Example: In
\_centered.auth-verification.tsx
, you can see how userByEmailOptions is used to query a user by email. This demonstrates the workflow rule:

Typescript
Apply
const { data: user, isLoading } = useQuery({
...userByEmailOptions(email),
enabled: !!email,
});
By following this workflow rule, AI models can effectively interact with APIs and forms in your project.

# Additional Tips:

Use motion and animation components (e.g., motion.div) for visually appealing transitions
Apply CSS styles using classes or inline styles to customize your form's appearance
