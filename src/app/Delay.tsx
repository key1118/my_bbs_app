"use client"

import { useState, useEffect, ReactNode } from 'react';
import Loader from './Loader';

interface DelayProps {
    children: ReactNode,
    wait?: number,
    fallback?: ReactNode
}

// タイマー機能だけを持つコンポーネント
export default function Delay({ children, wait = 3000, fallback = <Loader /> }: DelayProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), wait);
        return () => clearTimeout(timer);
    }, []);

    // 時間が経つまでは何も出さない（またはローダーを出す）
    return show ? children : fallback;
}