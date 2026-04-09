"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Staff, StaffFormData } from "@/types/staff";
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
import { staffSchema } from "@/validation/staff";
import BranchSelect from "../common/BranchSelect";
import UserSelect from "../common/UserSelect";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedStaff: Staff | null;
  onSuccess: () => void;
};

export default function StaffFormModal({
  open,
  setOpen,
  selectedStaff,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    mode: "onBlur",
    resolver: yupResolver(staffSchema),
  });
  const submitRef = useRef(false);
  // ✅ Reset form when modal opens or selectedStaff changes
  useEffect(() => {
    if (open) {
      if (selectedStaff) {
        console.log({ selectedStaff });
        reset({
          userId: selectedStaff.userId,
          branchId: selectedStaff.branchId,
          position: selectedStaff.position,
          salary: selectedStaff.salary,
          joinDate: selectedStaff.joinDate,
          shiftTiming: selectedStaff.shiftTiming,
        });
      } else {
        reset({
          userId: "",
          branchId: "",
          position: "",
          salary: "",
          joinDate: "",
          shiftTiming: "",
        });
      }
    }
  }, [selectedStaff, open]);

  const onSubmit = async (data: StaffFormData) => {
    try {
      const url = selectedStaff ? `/staff/${selectedStaff.id}` : "/staff";

      const apiCall = selectedStaff ? putApi : postApi;
      console.log({ data });
      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "Staff saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save staff");
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
            {selectedStaff ? "Edit Staff" : "Add Staff"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!submitRef.current) return;
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
            <Label className="mb-2">User</Label>
            <UserSelect
              value={watch("userId") ?? ""}
              onChange={(val) =>
                setValue("userId", val, { shouldValidate: true })
              }
              error={errors.userId?.message}
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.userId?.message}
            </p>
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
            <p className="text-red-500 text-xs mt-1">
              {errors.branchId?.message}
            </p>
          </div>

          <div>
            <Label className="mb-2">Position</Label>
            <Input key={selectedStaff?.id ?? "new"} {...register("position")} />
            <p className="text-red-500 text-xs mt-1">
              {errors.position?.message}
            </p>
          </div>
          <div>
            <Label className="mb-2">Salary</Label>
            <Input key={selectedStaff?.id ?? "new"} {...register("salary")} />
            <p className="text-red-500 text-xs mt-1">
              {errors.salary?.message}
            </p>
          </div>
          <div>
            <Label className="mb-2">Join Date</Label>
            <Input key={selectedStaff?.id ?? "new"} {...register("joinDate")} type="date" />
            <p className="text-red-500 text-xs mt-1">
              {errors.joinDate?.message}
            </p>
          </div>
          <div>
            <Label className="mb-2">Shift Timing</Label>
            <Input
              key={selectedStaff?.id ?? "new"}
              {...register("shiftTiming")}
              type="time"
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.shiftTiming?.message}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                submitRef.current = true;
              }}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
