import styles from "./styles.module.css";
import {SocketProvider} from "../../context/SocketProvider"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <SocketProvider>
        <body className={styles.body}>{children}</body>
      </SocketProvider>
    </html>
  );
}
