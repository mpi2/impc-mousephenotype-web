import { setUpFetchInterceptor } from "@/api-service/interceptor";

export function useFetchInterceptor() {
  const onChange = (val: boolean) => {
    // @ts-ignore
    (window["__APP_IS_READY"] as any) = !val;
  };

  setUpFetchInterceptor(onChange);

  return { appIsReady: true };
}
