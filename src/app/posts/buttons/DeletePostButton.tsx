'use client'

import { deletePost } from "@/actions/post";
import { useState } from "react";

export default function DeletePostButton({postId}: {postId: number}) {
  const [error, setError] = useState<string | null>(null);
  const handleDelete = async() => {
    if(window.confirm("本当に削除しますか？")){
      const result = await deletePost(postId);
      if(result && result.error) {
        setError(result.error);
      }
    }

  }
  return (
  <>
    <button className='btn-danger' onClick={handleDelete}>削除</button>
    {error && <p className="error-message">{error}</p>}
  </>
  )
}