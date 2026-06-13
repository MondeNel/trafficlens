import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import usePaymentStore from '../../store/paymentStore';
import NotificationsModal from '../citizen/NotificationsModal';
import PaymentModal from '../citizen/PaymentModal';
import demoUser from '../../data/demoUser';

const NAV_ITEMS = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> },
      { label: 'License Renewal', path: '/documents', icon: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></> },
      { label: "Driver's License", path: '/license', icon: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><circle cx="12" cy="14" r="2"/></> },
      { label: 'Vehicles', path: '/vehicles', icon: <><rect x="1" y="9" width="22" height="11" rx="2"/><path d="M5 9V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></> },
      { label: 'Traffic Fines', path: '/fines', icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'Profile', path: '/profile', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
      { label: 'Settings', path: '/settings', icon: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></> },
    ],
  },
];

const MOBILE_NAV = [
  { label: 'Home', path: '/dashboard', icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> },
  { label: 'License', path: '/license', icon: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><circle cx="12" cy="14" r="2"/></> },
  { label: 'Vehicles', path: '/vehicles', icon: <><rect x="1" y="9" width="22" height="11" rx="2"/><path d="M5 9V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></> },
  { label: 'Docs', path: '/documents', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
  { label: 'Profile', path: '/profile', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
];

const DEMO_NOTIFICATIONS = [
  { id: 1, type: 'warning', title: 'Fine Payment Due', message: 'You have 3 outstanding fines totalling R 2,850 due within 30 days.', created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), isRead: false },
  { id: 2, type: 'warning', title: 'License Disc Expiring', message: 'The license disc for GP 14 KW expires in 21 days. Renew to avoid penalties.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), isRead: false },
  { id: 3, type: 'info', title: 'License Renewal Reminder', message: 'Your driver\'s license expires on 28 Sep 2026. Start your renewal early to avoid delays.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), isRead: false },
  { id: 4, type: 'success', title: 'Payment Confirmed', message: 'Your fine payment of R 500 (TL-M4X9W) has been processed successfully.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), isRead: true },
];

const NavIcon = ({ path }) => (
  <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, flexShrink: 0, fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}>
    {path}
  </svg>
);

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const CitizenLayout = ({ user, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { fines: paymentFines, processPayment, isProcessing } = usePaymentStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);

  const currentUser = user || demoUser;
  const displayFines = paymentFines.length > 0 ? paymentFines : (currentUser?.fines || demoUser.fines);
  const unpaidFinesCount = displayFines.filter(f => f.status === 'unpaid').length;

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = currentUser ? `${(currentUser.first_name || '')[0] || ''}${(currentUser.last_name || '')[0] || ''}` : 'U';
  const isActive = (path) => location.pathname === path;

  const handleNotificationAction = (notification) => {
    markRead(notification.id);
    if (notification.type === 'warning' && notification.title.includes('Fine')) {
      const fine = displayFines.find(f => f.status === 'unpaid');
      if (fine) {
        setSelectedFine(fine);
        setNotifOpen(false);
        setShowPayment(true);
      }
    }
    if (notification.title.includes('License Disc')) { setNotifOpen(false); navigate('/vehicles'); }
    if (notification.title.includes('License Renewal')) { setNotifOpen(false); navigate('/license'); }
  };

  const handlePayment = async (fineId) => {
    await processPayment(fineId);
    setShowPayment(false);
    setSelectedFine(null);
  };

  const renderBadge = (item) => {
    const count = item.label === 'Traffic Fines' ? unpaidFinesCount : (item.badge || 0);
    if (count <= 0) return null;
    return (
      <span style={{ marginLeft: 'auto', background: '#C13333', color: 'white', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 10 }}>
        {count}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── DESKTOP SIDEBAR ──────────────────────────── */}
      <aside className="hidden md:flex flex-col shrink-0 relative overflow-hidden" style={{ width: 220, background: '#0B1628' }}>
        <div className="absolute pointer-events-none" style={{ top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(27,108,168,0.1)' }} />
        <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center shrink-0" style={{ width: 32, height: 32, background: '#1B6CA8', borderRadius: 8 }}>
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: 'white', fill: 'none', strokeWidth: 2.5 }}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>TrafficLens</div>
              <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 1 }}>Citizen Portal</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5" style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34, borderRadius: '50%', background: '#1B6CA8', border: '2px solid rgba(255,255,255,0.15)', fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 800, color: 'white' }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div className="truncate" style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{currentUser?.first_name} {currentUser?.last_name}</div>
            <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.32)', fontFamily: "'IBM Plex Mono', monospace", marginTop: 1 }}>{currentUser?.id_number?.slice(0, 13)}</div>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5" style={{ flex: 1, padding: '8px 10px' }}>
          {NAV_ITEMS.map(group => (
            <div key={group.section}>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', padding: '8px 10px 4px' }}>{group.section}</div>
              {group.items.map(item => {
                const active = isActive(item.path);
                return (
                  <button key={item.path} onClick={() => navigate(item.path)}
                    className="flex items-center gap-2 w-full text-left transition-colors"
                    style={{ padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", background: active ? '#1B6CA8' : 'transparent', color: active ? 'white' : 'rgba(255,255,255,0.48)' }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.48)'; }}}>
                    <NavIcon path={item.icon} />{item.label}
                    {renderBadge(item)}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full transition-colors"
            style={{ padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.28)', fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.28)'; e.currentTarget.style.background = 'transparent'; }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Sign out
          </button>
        </div>
      </aside>

      {/* ── MOBILE HEADER ──────────────────────────────── */}
      <div className="flex md:hidden items-center justify-between fixed top-0 left-0 right-0 z-50" style={{ background: '#0B1628', padding: '10px 16px' }}>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}>
          <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: 'white', fill: 'none', strokeWidth: 2 }}>
            {mobileMenuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: 'white' }}>TrafficLens</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setNotifOpen(true)} className="relative" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}>
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'white', fill: 'none', strokeWidth: 2 }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {unreadCount > 0 && <div style={{ position: 'absolute', top: 2, right: 2, width: 7, height: 7, background: '#C13333', borderRadius: '50%', border: '1.5px solid #0B1628' }} />}
          </button>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4 }}>
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>

      {/* ── MOBILE SLIDE-OUT MENU ──────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-12 left-0 bottom-0 z-40 overflow-y-auto" style={{ width: 240, background: '#0B1628', padding: 12 }}>
          {NAV_ITEMS.map(group => (
            <div key={group.section} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', padding: '8px 10px 4px' }}>{group.section}</div>
              {group.items.map(item => {
                const active = isActive(item.path);
                return (
                  <button key={item.path} onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 w-full text-left"
                    style={{ padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", background: active ? '#1B6CA8' : 'transparent', color: active ? 'white' : 'rgba(255,255,255,0.48)' }}>
                    <NavIcon path={item.icon} />{item.label}
                    {renderBadge(item)}
                  </button>
                );
              })}
            </div>
          ))}
          <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 w-full text-left"
            style={{ padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", background: 'transparent', color: '#C13333', marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14 }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Sign out
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 pt-12 md:pt-0">
        <div className="hidden md:flex items-center justify-between sticky top-0 z-10 shrink-0" style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 24px', height: 52 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{getGreeting()}, {currentUser?.first_name}</div>
            <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setNotifOpen(true)} className="relative flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer' }}>
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: '#64748B', fill: 'none', strokeWidth: 2 }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {unreadCount > 0 && <div style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: '#C13333', borderRadius: '50%', border: '1.5px solid white' }} />}
            </button>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-5 md:pb-5">
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION ───────────────────── */}
      <div className="flex md:hidden justify-around fixed bottom-0 left-0 right-0 z-50" style={{ background: '#0B1628', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '4px', paddingBottom: 'env(safe-area-inset-bottom, 4px)' }}>
        {MOBILE_NAV.map(item => {
          const active = isActive(item.path);
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 relative"
              style={{ padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: active ? '#1B6CA8' : 'rgba(255,255,255,0.35)', transition: 'all 0.15s', minWidth: 52 }}>
              {active && <div style={{ position: 'absolute', top: -1, width: 24, height: 2, background: '#1B6CA8', borderRadius: 2 }} />}
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 }}>{item.icon}</svg>
              <span style={{ fontSize: 9, fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── MODALS ──────────────────────────────────────── */}
      <NotificationsModal isOpen={notifOpen} onClose={() => setNotifOpen(false)}
        notifications={notifications} onMarkRead={markRead} onMarkAllRead={markAllRead} onAction={handleNotificationAction} />
      <PaymentModal isOpen={showPayment}
        onClose={() => { if (!isProcessing) { setShowPayment(false); setSelectedFine(null); } }}
        fine={selectedFine} onPay={handlePayment} isProcessing={isProcessing} />
    </div>
  );
};

export default CitizenLayout;