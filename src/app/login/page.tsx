import LoginPageClient from "./LoginPageClient";

export const metadata = {
  title: "Login | Realtime Products",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;

  const redirect = typeof params?.redirect === "string" && params.redirect.length > 0 ? params.redirect : "/products";

  return <LoginPageClient redirect={redirect} />;
}
