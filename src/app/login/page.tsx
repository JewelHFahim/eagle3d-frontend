import LoginPageClient from "./LoginPageClient";

export const metadata = {
  title: "Login | Realtime Products",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { redirect?: string };
}) {
  const redirect = typeof searchParams?.redirect === "string" ? searchParams.redirect : "/products";

  return <LoginPageClient redirect={redirect} />;
}
