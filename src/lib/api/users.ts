import { wrappedFetch } from "../utils";

export const getUser = async (uid: string) => {
  const res = await wrappedFetch(`/api/users/${uid}`, {
    method: "GET",
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
};

export const getUsers = async (limit:number, lastUid?: string) => {
  const url = lastUid
    ? `/api/users?limit=${limit}&last=${lastUid}`
    : `/api/users?limit=${limit}`;

  const res = await wrappedFetch(url, {
    method: "GET",
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    throw new Error(data.error);
  }
  
  return data;
};
