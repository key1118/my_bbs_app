import Link from 'next/link';

export default function AboutMe() {
  // 💡 プロフィール情報をオブジェクトにまとめておくと管理が楽です
  const profile = {
    name: "小松慶太朗",
    age: "22歳",
    university: "明治大学理工学部情報科学科",
    email: "kin29sasuke@outlook.com",
    github: "https://github.com/key1118/my_bbs_app/tree/extended-bbs-app",
    linkedin: "現在作成中",
    bio: "エンジニアのインターンシップ探しています！ご検討いただけると幸いです！ご興味ありましたらメールアドレスからお好きにメッセージしていただいて大丈夫です！"
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '0 20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        padding: '30px',
        border: '1px solid #eaeaea'
      }}>
        {/* ヘッダー部分（名前と年齢） */}
        <div style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '24px' }}>
            {profile.name}
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            {profile.age} / {profile.university}
          </p>
        </div>

        {/* 自己紹介テキスト */}
        <p style={{ color: '#444', lineHeight: '1.6', fontSize: '15px', marginBottom: '25px' }}>
          {profile.bio}
        </p>

        {/* 連絡先・リンク一覧 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* メールアドレス */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '2px' }}>
              EMAIL
            </span>
            <a href={`mailto:${profile.email}`} style={{ color: '#0070f3', textDecoration: 'none', fontSize: '15px', wordBreak: 'break-all' }}>
              {profile.email}
            </a>
          </div>

          {/* SNSリンク（スマホで狭くなっても崩れないように wrap を指定） */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            flexWrap: 'wrap', // 💡 画面が狭くなったら自動で2行に折り返す
            marginTop: '10px' 
          }}>
            {/* GitHub */}
            <Link 
              href={profile.github} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                flex: '1 1 140px', // 💡 スマホ幅では1列、PC幅では横並びになる魔法の指定
                textAlign: 'center',
                padding: '10px',
                backgroundColor: '#24292e',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              GitHub ↗
            </Link>

            {/* LinkedIn */}
            <Link 
              href={profile.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                flex: '1 1 140px',
                textAlign: 'center',
                padding: '10px',
                backgroundColor: '#0077b5',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              LinkedIn ↗
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}