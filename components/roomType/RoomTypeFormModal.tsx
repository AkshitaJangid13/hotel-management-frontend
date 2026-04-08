"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { roomTypeSchema } from "@/validation/roomType";
import { RoomType, RoomTypeFormData } from "@/types/roomType";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { postApi, putApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import BranchSelect from "../common/BranchSelect";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedRoomType: RoomType | null;
  onSuccess: () => void;
};

export default function RoomTypeFormModal({
  open,
  setOpen,
  selectedRoomType,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoomTypeFormData>({
    mode: "onBlur",
    resolver: yupResolver(roomTypeSchema),
  });
  const submitRef = useRef(false);
  // ✅ Reset form when modal opens or selectedRoomType changes
  useEffect(() => {
    if (open) {
      if (selectedRoomType) {
        console.log({ selectedRoomType });
        reset({
          name: selectedRoomType.name,
          branchId: selectedRoomType.branchId,
          description: selectedRoomType.description,
        });
      } else {
        reset({
          name: "",
          branchId: "",
          description: "",
        });
      }
    }
  }, [selectedRoomType, open]);


  const onSubmit = async (data: RoomTypeFormData) => {
    try {
      const url = selectedRoomType ? `/room-types/${selectedRoomType.id}` : "/room-types";

      const apiCall = selectedRoomType ? putApi : postApi;
      console.log({ data });
      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "Room Type saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save Room Type");
        onSuccess();
      }
    } catch {
      toast.error("Error saving Room Type");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle>
            {selectedRoomType ? "Edit RoomType" : "Add RoomType"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!submitRef.current) return; // ✅ only submit from Save button
            submitRef.current = false;
            handleSubmit(onSubmit)(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className="space-y-4"
        >
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              key={selectedRoomType?.id ?? "new"} // ✅ force remount on RoomType change
              {...register("name")}
            />
            <p className="text-red-500">{errors.name?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Description</Label>
            <Input
              key={selectedRoomType?.id ?? "new"} // ✅ force remount on RoomType change
              {...register("description")}
            />
            <p className="text-red-500">{errors.description?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Branch</Label>
            <BranchSelect
              value={watch("branchId") ?? ""}
              onChange={(val) =>
                setValue("branchId", val, { shouldValidate: true })
              }
              error={errors.branchId?.message}
            />
            <p className="text-red-500">{errors.branchId?.message}</p>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              align="right"
              onClick={() => {
                submitRef.current = true; // ✅ only set true when Save is clicked
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
