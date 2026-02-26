import Header from './Header';

export default function Layout({ children }) {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      minHeight: '100vh', 
      overflow: 'hidden' 
    }}>
      <Header />
      {children}
    </div>
  );
}
