import { api } from "./api";

async function getAllPasswd(id?: string) {
  try {
    if (id) {
      const data = await api.get(`/passwd?id=${id}`);
      return data.data;
    }

    const data = await api.get("/passwd");

    return data.data;
  } catch (error) {
    console.log(error);
  }
}

async function createPasswd(name: string, password: string) {
  try {
    const data = await api.post("/passwd", {
      name: name,
      password: password,
    });
    console.log(data, "123123123");
    return { data: data.data, status: data.status };
  } catch (error: any) {
    return { status: 400, data: error.response.data.error };
  }
}

async function updatePasswd(id: string, name: string, password: string) {
  try {
    const data = await api.put(`/passwd/${id}`, {
      name: name,
      password: password,
    });
    return { data: data.data, status: data.status };
  } catch (error) {
    console.log(error);
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

export { getAllPasswd, createPasswd, updatePasswd, deletePasswd };
