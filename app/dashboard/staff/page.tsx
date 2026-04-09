"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Staff } from "@/types/staff";
import StaffFormModal from "@/components/staff/StaffFormModal";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { deleteApi, getApi, putApi } from "@/lib/api";
import { CircleCheck, CircleX, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast/headless";
import DropdownMenu from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
export default function StaffPage() {
  const { loading } = useAuth();

  const [Staff, setStaff] = useState<Staff[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // 🔥 Pagination + Search state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStaff();
  }, [page, search]);

  const fetchStaff = async () => {
    try {
      const res = await getApi(
        `/staff?page=${page}&limit=${limit}&search=${search}`,
      );
      setStaff(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Fetch error");
    }
  };

  const handleEdit = (Staff: Staff) => {
    setSelectedStaff(Staff);
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedStaff(null);
    setOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const res = await putApi(`/staff/${id}/change-status`, {
      isActive: !currentStatus,
    });
    if (res.success) {
      toast.success(res.message || "Status updated successfully"); // refresh list
      fetchStaff();
    } else {
      toast.error("Failed to update status");
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Staff?")) return;
    const res = await deleteApi(`/staff/${id}`);
    if (res.success) {
      toast.success(res.message || "Staff deleted successfully"); // refresh list   
      fetchStaff(); // refresh list
    } else {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Staff</h1>
        <Button onClick={handleAdd}>Add Staff</Button>  
      </div>

      {/* 🔍 SEARCH */}
      <div className="mb-4">
        <Input
          placeholder="Search Staff..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Shift Timing</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>          
            {Staff.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-gray-400 py-10"
              >
                No Staff found.
              </TableCell>
            </TableRow>
          ) : (
            Staff.map((b, index) => (
              <TableRow key={b.id}>
                <TableCell className="text-gray-400">{index + 1}</TableCell>
                
                <TableCell className="font-medium text-gray-800">
                  {b.user?.name}
                </TableCell>
                <TableCell className="text-gray-600">{b.branch?.name}</TableCell>
                <TableCell className="text-gray-600">{b.position}</TableCell>
                <TableCell className="text-gray-600">{b.salary}</TableCell>
                <TableCell className="text-gray-600">{b.joinDate}</TableCell>
                <TableCell className="text-gray-600">{b.shiftTiming}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      b.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {b.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>

                <TableCell className="text-gray-500">
                  {new Date(b.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
      <StaffFormModal
        open={open}
        setOpen={setOpen}
        selectedStaff={selectedStaff}
        onSuccess={fetchStaff}
      />
    </div>
  );
}
