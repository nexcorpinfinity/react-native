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

export { loginApi };
