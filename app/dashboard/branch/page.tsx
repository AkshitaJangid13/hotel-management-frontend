"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Branch } from "@/types/branch";
import BranchFormModal from "@/components/branch/BranchFormModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { deleteApi, getApi, putApi } from "@/lib/api";
import {
  CircleCheck,
  CircleX,
  Pencil,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast/headless";
import DropdownMenu from "@/components/ui/dropdown-menu";

export default function BranchPage() {
  const { loading } = useAuth();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // 🔥 Pagination + Search state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBranches();
  }, [page, search]);

  const fetchBranches = async () => {
    try {
      const res = await getApi(
        `/branches?page=${page}&limit=${limit}&search=${search}`,
      );
      setBranches(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Fetch error");
    }
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedBranch(null);
    setOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const res = await putApi(`/branches/${id}/change-status`, {
      isActive: !currentStatus,
    });
    if (res.success) {
      toast.success(res.message || "Status updated successfully"); // refresh list
      fetchBranches();
    } else {
      toast.error("Failed to update status");
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    const res = await deleteApi(`/branches/${id}`);
    if (res.success) {
      toast.success(res.message || "Branch deleted successfully"); // refresh list
      fetchBranches(); // refresh list
    } else {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Branch</h1>
        <Button onClick={handleAdd}>Add Branch</Button>
      </div>

      {/* 🔍 SEARCH */}
      <div className="mb-4">
        <Input
          placeholder="Search branch..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* LIST */}
      <div className="grid grid-cols-3 gap-4">
        {branches.map((b) => (
          <Card key={b.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{b.name}</CardTitle>
                  <CardDescription>{b.address?.address}</CardDescription>
                </div>

                <DropdownMenu
                  items={[
                    {
                      label: "Edit",
                      icon: <Pencil size={14} className="text-blue-500" />,
                      onClick: () => handleEdit(b),
                    },
                    {
                      label: b.isActive ? "Set Inactive" : "Set Active",
                      icon: b.isActive ? (
                        <CircleX size={14} className="text-orange-500" />
                      ) : (
                        <CircleCheck size={14} className="text-green-500" />
                      ),
                      onClick: () => handleToggleStatus(b.id, b.isActive),
                      dividerAfter: true,
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 size={14} />,
                      onClick: () => handleDelete(b.id),
                      className: "text-red-600 hover:bg-red-50",
                    },
                  ]}
                />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* 📄 PAGINATION */}
      <div className="flex justify-center mt-6 gap-2">
        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* MODAL */}
      <BranchFormModal
        open={open}
        setOpen={setOpen}
        selectedBranch={selectedBranch}
        onSuccess={fetchBranches}
      />
    </div>
  );
}
