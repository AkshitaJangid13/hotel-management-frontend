"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "@/validation/user";
import { UserFormData, User } from "@/types/user";
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
import { Input } from "@/components/ui/input";
import CompanySelect from "../common/CompanySelect";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedUser: User | null;
  onSuccess: () => void;
};

export default function UserFormModal({
  open,
  setOpen,
  selectedUser,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    mode: "onBlur",
    resolver: yupResolver(userSchema) as any,
  });

  const submitRef = useRef(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      if (selectedUser) {
        reset({
          name: selectedUser.name,
          email: selectedUser.email,
          companyId: selectedUser.companyId,
          password: "",
          role: selectedUser.role,
        });
      } else {
        reset({
          name: "",
          email: "",
          companyId: "",
          role: "",
          password: "",
        });
      }
      setShowPassword(false); // ✅ reset password visibility on open
    }
  }, [selectedUser, open]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const url = selectedUser ? `/users/${selectedUser.id}` : "/users";
      const apiCall = selectedUser ? putApi : postApi;

      // ✅ don't send empty password on edit
      if (selectedUser && !data.password) {
        delete data.password;
      }

      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "User saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save user");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white rounded-lg max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
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
          {/* Name */}
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              key={selectedUser?.id ?? "new"}
              {...register("name")}
              placeholder="Enter name"
            />
            <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
          </div>

          {/* Email */}
          <div>
            <Label className="mb-2">Email</Label>
            <Input
              key={selectedUser?.id ?? "new"}
              {...register("email")}
              placeholder="Enter email"
            />
            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div>
            <Label className="mb-2">
              Password{" "}
              {selectedUser && (
                <span className="text-xs text-gray-400 font-normal">
                  (leave blank to keep current)
                </span>
              )}
            </Label>
            <div className="relative">
              <input
                key={selectedUser?.id ?? "new"}
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={
                  selectedUser
                    ? "Leave blank to keep current"
                    : "Enter password"
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-red-500 text-xs mt-1">
              {errors.password?.message}
            </p>
          </div>

          {/* Role */}
          <div>
            <Label className="mb-2">Role</Label>
            <select
              {...register("role")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
            <p className="text-red-500 text-xs mt-1">{errors.role?.message}</p>
          </div>

          {/* Company */}
          <div>
            <Label className="mb-2">Company</Label>
            <CompanySelect
              value={watch("companyId") ?? ""}
              onChange={(val) =>
                setValue("companyId", val, { shouldValidate: true })
              }
              error={errors.companyId?.message} // ✅ error handled inside CompanySelect
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit" // ✅ removed invalid align="right"
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
