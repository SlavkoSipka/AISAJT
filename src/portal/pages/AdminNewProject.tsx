import { NewProjectForm } from '../components/admin/NewProjectForm';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import '../portal.css';

export function AdminNewProject() {
  return (
    <div className="portal-root">
      <Sidebar />
      <div className="md:ml-[220px] min-h-screen pb-20 md:pb-0">
        <Topbar title="Novi projekat" />
        <main className="px-6 py-5">
          <h2 className="text-[16px] font-semibold text-[#1A1916] tracking-[-0.3px] mb-5">
            Kreiraj projekat i pozovi klijenta
          </h2>
          <NewProjectForm />
        </main>
      </div>
    </div>
  );
}
