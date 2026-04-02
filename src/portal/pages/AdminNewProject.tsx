import { NewProjectForm } from '../components/admin/NewProjectForm';
import { Topbar } from '../components/layout/Topbar';
import '../portal.css';

export function AdminNewProject() {
  return (
    <>
      <Topbar title="Novi projekat" />
      <main className="px-6 py-5">
          <h2 className="text-[16px] font-semibold text-[#1a2030] tracking-[-0.3px] mb-5">
            Kreiraj projekat i pozovi klijenta
          </h2>
          <NewProjectForm />
        </main>
    </>
  );
}
