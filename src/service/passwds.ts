import { api } from "./api";

async function getAllPasswd(secure_code: string, id?: string) {
    try {
        if (id) {
            const { data } = await api.get(
                `/passwd?secret_code=${secure_code}`
            );
            return data;
        }

        const { data } = await api.get(`/passwd?secret_code=${secure_code}`);

        return data;
    } catch (error: any) {
        console.log(error);
        return error.response;
    }
}

async function getAllPasswdCount() {
    try {
        const data = await api.get(`/passwd/count`);

        return data.data;
    } catch (error) {
        console.log(error);
    }
}

async function getAllPasswdAdminCount() {
    try {
        const data = await api.get(`/passwd/count-admin`);

        return data.data;
    } catch (error) {
        console.log(error);
    }
}

async function createPasswd(
    name: string,
    login_email: string,
    password: string
) {
    try {
        const { data } = await api.post("/passwd", {
            name: name,
            login_email: login_email,
            password: password,
        });

        return data;
    } catch (error: any) {
        return error.response;
    }
}

async function updatePasswd(
    id: string,
    name: string,
    login_email: string,
    password: string
) {
    try {
        const { data } = await api.put(`/passwd/${id}`, {
            name: name,
            login_email: login_email,
            password: password,
        });
        return data;
    } catch (error: any) {
        return error.response;
    }
}

async function deletePasswd(id: string) {
    try {
        const data = await api.delete(`/passwd/${id}`);

        return data.data;
    } catch (error) {
        console.log(error);
    }
}

export {
    getAllPasswd,
    createPasswd,
    updatePasswd,
    deletePasswd,
    getAllPasswdCount,
    getAllPasswdAdminCount,
};
