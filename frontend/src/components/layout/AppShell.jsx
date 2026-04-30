import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MusicPlayer from '../player/MusicPlayer';

function AppShell() {
  return (
    <div className="min-h-screen bg-grid bg-[size:42px_42px]">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 pb-32 pt-4 sm:px-6 lg:px-8">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Topbar />
          <main className="min-h-[calc(100vh-11rem)]">
            <Outlet />
          </main>
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
}

export default AppShell;
