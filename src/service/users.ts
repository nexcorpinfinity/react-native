import { api } from "./api";

async function loginApi(email: string, password: string) {
  try {
    const { data } = await api.post("/auth", {
      email: email,
      password: password,
    });

    return data.token;
  } catch (error) {
    console.log(error);
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

async function deletedUserByAdmin(id: string) {
  try {
    const data = await api.get("/users");

    return data.data;
  } catch (error) {
    console.log(error);
  }
}

export { getAllUsers, loginApi, createUser, getProfileUser };
