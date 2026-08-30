import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfileUsernameRedirect({ params }: Props) {
  const { username } = await params;
  redirect(`/member/${encodeURIComponent(username)}`);
}
