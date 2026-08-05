import { EmptyState } from "@/components/dashboard/EmptyState";
import { RoleManagementTable } from "@/components/admin/RoleManagementTable";
import { getAllUsersForRoles, getCurrentAdminProfile } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminRolesPage() {
  const [users, admin] = await Promise.all([getAllUsersForRoles(), getCurrentAdminProfile()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Roles &amp; Permissions</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Three roles govern the whole platform — student, teacher, admin — enforced at the database level, not just hidden in the UI.
      </p>
      {users.length === 0 ? (
        <EmptyState className="mt-8" icon="🔑" title="No users yet" body="Registered users will appear here for role management." />
      ) : (
        <div className="mt-8">
          <RoleManagementTable users={users} currentAdminId={admin?.id ?? ""} />
        </div>
      )}
    </div>
  );
}
