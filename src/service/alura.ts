import { api } from "./api";

async function getAllAlura() {
  try {
    const data = await api.get("/emails");
    return data.data;
  } catch (error) {
    console.log(error);
  }
}

export { getAllAlura };
