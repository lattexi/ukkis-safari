export async function fetchData(url: string) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
  });
}

export async function postData(url: string, data: FormData) {
  return fetch(url, {
    method: "POST",
    body: data, // <-- fetch lisää oikean Content-Type + boundary
  }).then(async (response) => {
    if (!response.ok) {
      const text = await response.text();
      console.error("Server returned error:\n", text);
      throw new Error("Upload failed");
    }
    return response.json();
  });
}

export async function deleteData(url: string) {
  return fetch(url, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return;
  });
}
