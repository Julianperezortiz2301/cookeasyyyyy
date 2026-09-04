import { getAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { DeleteUserButton } from "@/components/admin/delete-user-button";

export default async function AdminUsersPage() {
  const session = await getAdminSession();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { recipes: true, favorites: true } },
    },
  });

  return (
    <div className="rounded-2xl bg-white shadow-card">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="font-semibold text-gray-900">All users ({users.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Recipes</th>
              <th className="px-6 py-3 font-medium">Favorites</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-3 text-gray-500">{user.email}</td>
                <td className="px-6 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-primary-100 text-primary-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-500">{user._count.recipes}</td>
                <td className="px-6 py-3 text-gray-500">{user._count.favorites}</td>
                <td className="px-6 py-3">
                  {user.role !== "ADMIN" && user.id !== session?.user.id && (
                    <DeleteUserButton userId={user.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
