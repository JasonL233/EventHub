'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button type="button" onClick={() => router.push('/loginPage')}>Login</button>
        <button type="button" onClick={() => router.push('/eventPage')}>Events</button>
        <button type="button" onClick={() => router.push('/createEventPage')}>Create an Event</button>
        <button type="button" onClick={() => router.push('/profilePage')}>profile</button>
      </main>
      
    </div>
  );
}
