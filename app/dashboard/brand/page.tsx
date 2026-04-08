"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Brand } from "@/types/brand";
import BrandFormModal from "@/components/brand/BrandFormModal";
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
  Eye,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
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
export default function BrandPage() {
  const { loading } = useAuth();

  const [brand, setBrand] = useState<Brand[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // 🔥 Pagination + Search state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBrand();
  }, [page, search]);

  const fetchBrand = async () => {
    try {
      const res = await getApi(
        `/brands?page=${page}&limit=${limit}&search=${search}`,
      );
      setBrand(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Fetch error");
    }
  };

  const handleEdit = (Brand: Brand) => {
    setSelectedBrand(Brand);
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedBrand(null);
    setOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const res = await putApi(`/brands/${id}/change-status`, {
      isActive: !currentStatus,
    });
    if (res.success) {
      toast.success(res.message || "Status updated successfully"); // refresh list
      fetchBrand();
    } else {
      toast.error("Failed to update status");
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Brand?")) return;
    const res = await deleteApi(`/brands/${id}`);
    if (res.success) {
      toast.success(res.message || "Brand deleted successfully"); // refresh list
      fetchBrand(); // refresh list
    } else {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Brand</h1>
        <Button onClick={handleAdd}>Add Brand</Button>
      </div>

      {/* 🔍 SEARCH */}
      <div className="mb-4">
        <Input
          placeholder="Search Brand..."
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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brand.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-gray-400 py-10"
              >
                No brands found.
              </TableCell>
            </TableRow>
          ) : (
            brand.map((b, index) => (
              <TableRow key={b.id}>
                <TableCell className="text-gray-400">{index + 1}</TableCell>
                <TableCell className="font-medium text-gray-800">
                  {b.name}
                </TableCell>
                <TableCell className="text-gray-600">{b.email}</TableCell>
                <TableCell className="text-gray-600">{b.phone}</TableCell>
                <TableCell className="text-gray-600">
                  {b.branch?.name ?? "—"}
                </TableCell>
                <TableCell className="text-gray-600 max-w-[200px] truncate">
                  {b.address?.address ?? "—"}
                </TableCell>
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
      <BrandFormModal
        open={open}
        setOpen={setOpen}
        selectedBrand={selectedBrand}
        onSuccess={fetchBrand}
      />
    </div>
  );
}
