import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const cookieJar = await cookies();
  const locale = cookieJar.get("locale")?.value ?? "en";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
