import { apiUrl, isTesting } from "./env";

export const URI = apiUrl + "/api/";
export const CLIENT_ERRORS = [400, 401, 403, 404];

interface UserMessage {
  text: string;
  field: string | null;
}

/*
вопрос: нужен ли код для сообщения об ошибке? может достаточно текстового сообщения?
с одной стороны хорошо отправлять текстовые сообщения для того чтобы зайти в консоль разработчика
и увидеть причину ошибки, не сопоставляя номер ошибки с текстом
с другой стороны номер ошибки можно отправлять в статистику
еще можно создать перечисления с номером ошибки и не работать с текстом в коде.
а еще ошибки могут повторяться, то есть за один запрос может быть несколько ошибок
*/
interface ErrorType {
  // текстовый ид ошибки
  message: string;
  // сообщение для клиента, если присутствует, показывать клиенту.
  userMessage: UserMessage | null;
}

const enum BodyStatus {
  Success = "Success",
  Error = "Error",
}

interface BodySuccess<D = any> {
  status: BodyStatus.Success;
  data: D; // данные для приложения
}

interface BodyError {
  status: BodyStatus.Error;
  errors: ErrorType[]; // описание ошибки для логов
}

type BodyType<D> = BodySuccess<D> | BodyError;

// type Body<D> = BodyType<D> & {
//   unwrap(): D
// };

class ResBody<D = any> {
  status: BodyStatus;
  data?: D;
  errors?: ErrorType[];

  constructor(body: BodyType<D>) {
    this.status = body.status;

    if (body.status === BodyStatus.Success) {
      this.data = body.data;
    } else {
      this.errors = body.errors;
    }
  }

  unwrap(this: this): D {
    if (this.status === BodyStatus.Success) {
      return this.data as D;
    } else {
      throw new EntityError(this.errors ?? []);
    }
  }
}

export class ApiError extends Error {
  statusCode: number;
  messages: string[];

  constructor(statusCode: number, messages: string[]) {
    super(messages.join("\n"));
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.messages = messages;
  }
}

export class EntityError extends Error {
  errors: ErrorType[];

  constructor(errors: ErrorType[]) {
    super("entity error");
    this.name = "EntityError";
    this.errors = errors;
  }
}

export type ParamsType = Record<string, string>;

export const enum Method {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
}

export interface RequestParams {
  path: string;
  params?: ParamsType;
  body?: any;
  method: Method;
  requiredSignin?: closure;
  metricSend?: (url: string, ms: number) => void;
  errorSend?: (statusCode: number, name: string, message: string) => void;
  timeout?: number;
}

/**
 * Все запросы могут вернуть либо ОК,
 * либо Unauthorized 401 - необходимо перенаправить на страницу авторизации?
 * или вывести сообщение о необходимости авторизации
 * либо 404 - "Не найдено..."
 * либо Server error 500 - необходимо вывести ошибку "Ошибка..."
 * либо Bad request 400 - необходимо вывести ошибку "Ошибка..."
 * либо 403 - "Ошибка..."
 * Либо свою кастомную ошибку - в этом случае необходимо вывести эту кастомную ошибку
 * Кастомная ошибка отдается как 200, но у нее есть свой номер ошибки, сообщение для консоли и сообщение для пользователя
 * Кастомные ошибки должны обрабатываться в компоненте, в котором делается запрос. В теле промиса в then, а не catch.
 * */
export const request = async <D>(data: RequestParams): Promise<ResBody<D>> => {
  const { params, path, body, method, requiredSignin, metricSend } = data;
  let uri = path;

  if (params) {
    const urlParams = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      urlParams.append(k, v);
    }
    const stringParams = urlParams.toString();
    if (stringParams) {
      uri = `${uri}?${urlParams.toString()}`;
    }
  }

  const headers = new Headers();

  if (body) {
    headers.set("Content-Type", "application/json");
  }

  let reqBody = null;

  if (body) {
    if (typeof body === "string") {
      reqBody = body;
    } else {
      reqBody = JSON.stringify(body);
    }
  }

  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, data.timeout ?? 2000);

  // no-cors
  // cors - если есть заголовки CORS у стороннего сайта
  // same-origin - тот же самый origin, в рамках одного сайта
  const mode: RequestMode = isTesting ? "cors" : "same-origin";

  // include, same-origin, omit
  const credentials: RequestCredentials = isTesting ? "include" : "same-origin";

  // default, no-cache, reload, force-cache, only-if-cached
  // const cache = "default" as const;

  const options: RequestInit = {
    method,
    headers,
    body: reqBody,
    mode,
    credentials,
    signal: controller.signal,
    priority: "high",
  };

  const time = performance.now();

  const res = await fetch(uri, options);
  const contentType = res.headers.get("Content-Type");
  const isJson = contentType === "application/json";

  if (res.ok) {
    let body: BodyType<D> = {
      status: BodyStatus.Success,
      data: null as D,
    };

    if (isJson) {
      body = await res.json();
    } else if (contentType === "text/plain") {
      const data = (await res.text()) as D;
      body.data = data;
    } else if (contentType === "application/octet-stream") {
      const buffer = await res.arrayBuffer();
      const data = new DataView(buffer) as D;
      body.data = data;
    }

    const ms = performance.now() - time;
    metricSend?.(uri, ms);

    return new ResBody(body);
  }

  // Unprocessable Entity
  if (res.status === 422 && isJson) {
    const json: BodyType<D> = await res.json();
    const ms = performance.now() - time;
    metricSend?.(uri, ms);

    return new ResBody(json);
  }

  let messages = [] as string[];

  if (CLIENT_ERRORS.includes(res.status) && isJson) {
    const json: BodyError = await res.json();
    messages = json.errors.map((e) => e.message);
  }

  const ms = performance.now() - time;
  metricSend?.(uri, ms);

  // const isClientError = [400, 401, 403, 404].includes(res.status);
  // if (!isClientError) {
  //   const text = await res.text();
  //   errorSend?.(res.status, "api_error", text);
  // }

  if (res.status === 401) {
    requiredSignin?.();
  }

  throw new ApiError(res.status, messages);

  // return new ResBody({
  //   status: BodyStatus.Error,
  //   errors: [
  //     {
  //       message: res.statusText,
  //       userMessage: null,
  //     },
  //   ],
  // });
};
