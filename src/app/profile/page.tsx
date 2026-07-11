'use server'

import { getUsers } from "@/actions/users"
import Link from "next/link";
import ProfileList from "./ProfileList";

export default async function Profile() {
    const users = await getUsers();

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <Link
                href='/'
                style={{
                    display: 'inline-block',
                    marginBottom: '20px',
                    color: '#0070f3',
                }}
            >
                &larr; ホームに戻る
            </Link>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>ユーザー一覧</h2>

            <ProfileList users={users} />
        </div>
    );
}