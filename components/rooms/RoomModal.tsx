"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { roomSchema } from "@/validation/room";
import { RoomFormData, Room } from "@/types/room";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { postApi, putApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import RoomTypeSelect from "../common/RoomTypeSelect";
import { Input } from "@/components/ui/input";
import CompanySelect from "../common/CompanySelect";
import BranchSelect from "../common/BranchSelect";
import BrandSelect from "../common/BrandSelect";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedRoom: Room | null;
  onSuccess: () => void;
};

export default function RoomFormModal({
  open,
  setOpen,
  selectedRoom,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormData>({
    mode: "onBlur",
    resolver: yupResolver(roomSchema),
  });
  const submitRef = useRef(false);
  // ✅ Reset form when modal opens or selectedRoom changes
  useEffect(() => {
    if (open) {
      if (selectedRoom) {
        console.log({ selectedRoom });
        reset({
          roomTypeId: selectedRoom.roomTypeId,
          roomNumber: selectedRoom.roomNumber,
          companyId: selectedRoom.companyId,
          brandId: selectedRoom.brandId,
          branchId: selectedRoom.branchId,
          floor: selectedRoom.floor,
          notes: selectedRoom.notes,
        });
      } else {
        reset({
          roomTypeId: "",
          roomNumber: "",
          companyId: "",
          brandId: "",
          branchId: "",
          floor: "",
          notes: "",
        });
      }
    }
  }, [selectedRoom, open]);

  const onSubmit = async (data: RoomFormData) => {
    try {
      const url = selectedRoom ? `/rooms/${selectedRoom.id}` : "/rooms";

      const apiCall = selectedRoom ? putApi : postApi;
      console.log({ data });
      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "Room Type Amenities saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save Room Type Amenities");
        onSuccess();
      }
    } catch {
      toast.error("Error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedRoom
              ? "Edit Room Type Amenitie"
              : "Add Room Type Amenitie"}
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
            <Label className="mb-2">Room Number</Label>
            <Input
              key={selectedRoom?.id ?? "new"}
              {...register("roomNumber")}
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.roomNumber?.message}
            </p>
          </div>
          <div>
            <Label className="mb-2">Notes</Label>
            <Input key={selectedRoom?.id ?? "new"} {...register("notes")} />
            <p className="text-red-500 text-xs mt-1">{errors.notes?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Floor</Label>
            <Input key={selectedRoom?.id ?? "new"} {...register("floor")} />
            <p className="text-red-500 text-xs mt-1">{errors.floor?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Company</Label>
            <CompanySelect
              value={watch("companyId") ?? ""}
              onChange={(val) =>
                setValue("companyId", val, { shouldValidate: true })
              }
              error={errors.companyId?.message}
            />
            <p className="text-red-500">{errors.companyId?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Room Type</Label>
            <RoomTypeSelect
              value={watch("roomTypeId") ?? ""}
              onChange={(val) =>
                setValue("roomTypeId", val, { shouldValidate: true })
              }
              error={errors.roomTypeId?.message}
            />
            <p className="text-red-500">{errors.roomTypeId?.message}</p>
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
          <div>
            <Label className="mb-2">Brand</Label>
            <BrandSelect
              value={watch("brandId") ?? ""}
              onChange={(val) =>
                setValue("brandId", val, { shouldValidate: true })
              }
              error={errors.brandId?.message}
            />
            <p className="text-red-500">{errors.brandId?.message}</p>
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
