'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  User,
  Shield,
  Phone,
  Mail,
  Calendar,
  ExternalLink
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { Input, Select } from '@/components/ui/FormELements';
import Link from 'next/link';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  primaryPhone: string;
  role: string;
  createdAt: string;
}

interface Meta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function UserTable() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  const latestRequest = useRef(0);
  const fetchUsers = useCallback(async () => {
    const requestId = Date.now();
    latestRequest.current = requestId;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: meta.page.toString(),
        pageSize: meta.pageSize.toString(),
        ...(search && { q: search }),
        ...(role && { role }),
      });

      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      // Apply only if this is the latest request
      if (latestRequest.current === requestId) {
        setUsers(response.data.data);
        setMeta(prev => {
          const next = response.data.meta as Meta;
          // Avoid unnecessary state updates that can trigger re-renders
          if (
            prev.page === next.page &&
            prev.pageSize === next.pageSize &&
            prev.total === next.total &&
            prev.totalPages === next.totalPages
          ) {
            return prev;
          }
          return next;
        });
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      if (latestRequest.current === requestId) {
        setIsLoading(false);
      }
    }
  }, [meta.page, meta.pageSize, search, role]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [fetchUsers]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bento-card p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input 
            placeholder="Search by name, email, or phone..." 
            className="pl-9 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="">All Roles</option>
          <option value="APPLICANT">Applicant</option>
          <option value="ADMIN_TIER1">Admin Tier 1</option>
          <option value="ADMIN_TIER2">Admin Tier 2</option>
        </Select>
      </div>

      {/* Table */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/50 uppercase bg-slate-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-foreground/50">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-foreground/50">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{user.fullName}</div>
                          <div className="text-xs text-foreground/50 truncate max-w-[200px]">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-foreground/60">
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="w-3 h-3" />
                          {user.primaryPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.role.startsWith('ADMIN') 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {user.role.startsWith('ADMIN') ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/50 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/users/detail?id=${user.id}`}
                        className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
                      >
                        View Details
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="text-sm text-foreground/60">
            Showing <span className="font-medium">{(meta.page - 1) * meta.pageSize + 1}</span> to <span className="font-medium">{Math.min(meta.page * meta.pageSize, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMeta(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={meta.page === 1}
              className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-zinc-800 text-foreground/60"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMeta(prev => ({ ...prev, page: Math.min(meta.totalPages, prev.page + 1) }))}
              disabled={meta.page >= meta.totalPages}
              className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-zinc-800 text-foreground/60"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
