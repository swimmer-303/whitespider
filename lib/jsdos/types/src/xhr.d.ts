type HttpMethod = "get" | "post" | "head" | "put";
type ResponseType = XMLHttpRequestResponseType;
type ProgressCallback = (progress: number) => void;
type HttpHeaders = { [name: string]: string };

export async function sendRequest(method: HttpMethod, url: string, responseType: ResponseType, body?: string | ArrayBuffer, onprogress?: ProgressCallback, headers?: HttpHeaders): Promise<string | ArrayBuffer> {
  const request = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    request.open(method, url, true);
    request.responseType = responseType;
    if (onprogress) request.onprogress = onprogress;
    if (headers) {
      for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
          request.setRequestHeader(key, headers[key]);
        }
      }
    }
    request.onload = () => {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(new Error(`HTTP request failed with status ${request.status}`));
      }
    };
    request.onerror = () => reject(new Error("HTTP request failed"));
    if (body) request.send(body);
    else request.send();
  });
}

export async function postObject(url: string, data?: string | ArrayBuffer): Promise<any> {
  return sendRequest("post", url, "json", data);
}

export async function getObject(url: string): Promise<any> {
  return sendRequest("get", url, "json");
}

export async function post(url: string, responseType: ResponseType, data?: string | ArrayBuffer): Promise<string | ArrayBuffer> {
  return sendRequest("post", url, responseType, data);
}
