import PasswordResetPage from '@/pages/PasswordResetPage';

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const token = typeof params.token === 'string' ? params.token : undefined;

    return <PasswordResetPage token={token} />;
}
