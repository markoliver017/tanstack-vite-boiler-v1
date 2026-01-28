import type { CreateUserValues } from "./zUsersSchema";

// 2. Mock Data Store (In-memory for simulation)
export let mockUsers = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
];

// 3. Mock API Function
export const createUserApi = async (data: CreateUserValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network lag
    const newUser = { id: Math.random().toString(), ...data };
    mockUsers = [...mockUsers, newUser];
    return newUser;
};

// export const getUserByEmail = (email: string) => {
//     const res = await
// };
