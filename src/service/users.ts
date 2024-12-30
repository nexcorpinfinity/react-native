import { api } from "./api";

async function loginApi(email: string, password: string) {
    try {
        const response = await api.post("/auth", {
            email: email,
            password: password,
        });
        return response.data;
    } catch (error: any) {
        return error.response;
    }
}

async function createUser(
    name: string,
    email: string,
    password: string,
    permission: string
) {
    try {
        const data = await api.post("/users", {
            name: name,
            email: email,
            password: password,
            permission: permission,
        });

        return data;
    } catch (error) {
        console.log(error);
    }
}

async function createSecureCode(code: string) {
    try {
        const { data } = await api.post("/users/set-code", {
            secure_code: code,
        });

        return data;
    } catch (error: any) {
        return error.response;
    }
}

async function getHashCode(code: string) {
    try {
        const { data } = await api.get(`/users/get-code?code=${code}`);
        return data;
    } catch (error: any) {
        return error.response;
    }
}

async function getProfileUser(id: string) {
    try {
        const data = await api.get(`/users/profile-user?id=${id}`);
        return data.data;
    } catch (error) {
        console.log(error);
    }
}

async function getAllUsers() {
    try {
        const data = await api.get("/users");

        return data.data;
    } catch (error) {
        console.log(error);
    }
}

async function getAllUsersCount() {
    try {
        const data = await api.get("/users/count");

        return data.data;
    } catch (error) {
        console.log(error);
    }
}

async function updateProfile(
    updateData: {
        name: string;
        email: string;
        password: string;
        permission: string;
    },
    id?: string
) {
    try {
        if (id) {
            const { data } = await api.put(`/users?id=${id}`, {
                name: updateData.name,
                email: updateData.email,
                password: updateData.password,
                permission: updateData.permission,
            });

            return data;
        }

        const { data } = await api.put(`/users`, {
            name: updateData.name,
            email: updateData.email,
            password: updateData.password,
            permission: updateData.permission,
        });

        return data;
    } catch (error) {
        console.log(error);
    }
}

async function deletedUserByAdmin(id: string) {
    try {
        const data = await api.delete(`/users?id=${id}`);
        return data.data;
    } catch (error) {
        console.log(error);
    }
}

export {
    getAllUsers,
    loginApi,
    createUser,
    getProfileUser,
    deletedUserByAdmin,
    updateProfile,
    getAllUsersCount,
    createSecureCode,
    getHashCode,
};
