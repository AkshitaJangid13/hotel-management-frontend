"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Room } from "@/types/room";
import RoomFormModal from "@/components/rooms/RoomModal";
import { Button } from "@/components/ui/button";

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
export default function RoomPage() {
  const { loading } = useAuth();

  const [Room, setRoom] = useState<Room[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // 🔥 Pagination + Search state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRoom();
  }, [page, search]);

  const fetchRoom = async () => {
    try {
      const res = await getApi(
        `/rooms?page=${page}&limit=${limit}&search=${search}`,
      );
      setRoom(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Fetch error");
    }
  };

  const handleEdit = (Room: Room) => {
    setSelectedRoom(Room);
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedRoom(null);
    setOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const res = await putApi(`/rooms/${id}/change-status`, {
      isActive: !currentStatus,
    });
    if (res.success) {
      toast.success(res.message || "Status updated successfully"); // refresh list
      fetchRoom();
    } else {
      toast.error("Failed to update status");
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Room?")) return;
    const res = await deleteApi(`/rooms/${id}`);
    if (res.success) {
      toast.success(res.message || "Room deleted successfully"); // refresh list
      fetchRoom(); // refresh list
    } else {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Room</h1>
        <Button onClick={handleAdd}>Add Room</Button>
      </div>

      {/* 🔍 SEARCH */}
      <div className="mb-4">
        <Input
          placeholder="Search Room..."
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
            <TableHead>Room NO</TableHead>
            <TableHead>Floor</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Room Type</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Room.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-gray-400 py-10"
              >
                No rooms found.
              </TableCell>
            </TableRow>
          ) : (
            Room.map((b, index) => (
              <TableRow key={b.id}>
                <TableCell className="text-gray-400">{index + 1}</TableCell>
                <TableCell className="font-medium text-gray-800">
                  {b.roomNumber}
                </TableCell>
                <TableCell className="text-gray-600">{b.floor}</TableCell>
                <TableCell className="text-gray-600">{b.notes}</TableCell>

                <TableCell className="text-gray-600">
                  {b.company?.name ?? "—"}
                </TableCell>
                <TableCell className="text-gray-600">
                  {b.roomType?.name ?? "—"}
                </TableCell>
                <TableCell className="text-gray-600">
                  {b.branch?.name ?? "—"}
                </TableCell>
                <TableCell className="text-gray-600">
                  {b.brand?.name ?? "—"}
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
      <RoomFormModal
        open={open}
        setOpen={setOpen}
        selectedRoom={selectedRoom}
        onSuccess={fetchRoom}
      />
    </div>
  );
}
