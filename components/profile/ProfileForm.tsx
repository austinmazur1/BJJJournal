"use client";

import { useState } from "react";
import { UserBeltLevel, BeltStripe } from "@/lib/models/User";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Edit2, Save, Trash2, X } from "lucide-react";
import type { StoredUser } from "@/lib/userStore";
import {
  ProfileInformationValidation,
  profileInformationValidation,
} from "@/lib/validations/profileInformation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AlertDialog from "../AlertDialog";

interface ProfileFormProps {
  user: StoredUser;
  onUpdate?: (
    data: ProfileInformationValidation
  ) => Promise<{ success: boolean }>;
  onDelete?: () => Promise<{ success: boolean }>;
}

export function ProfileForm({ user, onUpdate, onDelete }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInformationValidation>({
    resolver: zodResolver(profileInformationValidation),
    defaultValues: {
      name: user.name || "",
      beltLevel: user.beltLevel || UserBeltLevel.WHITE,
      beltStripe: user.beltStripe || BeltStripe.NONE,
      trainingLocation: user.trainingLocation || "",
    },
  });

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const getBeltDisplay = () => {
    const belt = watch("beltLevel") || "Not set";
    const stripe =
      watch("beltStripe") && watch("beltStripe") !== BeltStripe.NONE
        ? ` (${watch("beltStripe")} stripe${
            watch("beltStripe") !== BeltStripe.ONE ? "s" : ""
          })`
        : "";
    return `${belt}${stripe}`;
  };

  return (
    <Card>
      <form
        onSubmit={handleSubmit(async (data) => {
          const result = await onUpdate?.(data);
          if (result && result.success) {
            setIsEditing(false);
            trigger();
          }
        })}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your profile details and training information
              </CardDescription>
            </div>
            {!isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit2 className="size-4" />
                  Edit
                </Button>
                <AlertDialog
                  title="Delete Account"
                  description="Are you sure you want to delete your account?"
                  onConfirm={() => onDelete?.()}
                  trigger={
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="size-4" />
                      Delete Account
                    </Button>
                  }
                  confirmButtonText="Delete"
                  confirmButtonVariant="destructive"
                  confirmButtonIcon={<Trash2 className="size-4" />}
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            {isEditing ? (
              <Input
                id="name"
                type="text"
                value={watch("name")}
                onChange={(e) => setValue("name", e.target.value)}
                placeholder="Your name"
              />
            ) : (
              <div className="px-3 py-2 text-sm border border-transparent bg-gray-50 rounded-md">
                {watch("name") || "Not set"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="beltLevel">Belt Level</Label>
            {isEditing ? (
              <Select
                value={watch("beltLevel")}
                onValueChange={(value) =>
                  setValue("beltLevel", value as UserBeltLevel)
                }
              >
                <SelectTrigger id="beltLevel" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserBeltLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level} Belt
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="px-3 py-2 text-sm border border-transparent bg-gray-50 rounded-md">
                {getBeltDisplay()}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="beltStripe">Belt Stripe</Label>
            {isEditing ? (
              <Select
                value={watch("beltStripe")}
                onValueChange={(value) =>
                  setValue("beltStripe", value as BeltStripe)
                }
              >
                <SelectTrigger id="beltStripe" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(BeltStripe).map((stripe) => (
                    <SelectItem key={stripe} value={stripe}>
                      {stripe === BeltStripe.NONE
                        ? "No Stripes"
                        : `${stripe} Stripe${
                            stripe !== BeltStripe.ONE ? "s" : ""
                          }`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="px-3 py-2 text-sm border border-transparent bg-gray-50 rounded-md">
                {watch("beltStripe") === BeltStripe.NONE
                  ? "No Stripes"
                  : `${watch("beltStripe")} Stripe${
                      watch("beltStripe") !== BeltStripe.ONE ? "s" : ""
                    }`}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainingLocation">Training Location/Gym</Label>
            {isEditing ? (
              <Input
                id="trainingLocation"
                type="text"
                value={watch("trainingLocation")}
                onChange={(e) => setValue("trainingLocation", e.target.value)}
                placeholder="e.g., Gracie Barra Downtown, Alliance BJJ..."
              />
            ) : (
              <div className="px-3 py-2 text-sm border border-transparent bg-gray-50 rounded-md">
                {watch("trainingLocation") || "Not set"}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 gap-2"
              >
                <Save className="size-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="gap-2"
              >
                <X className="size-4" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </form>
    </Card>
  );
}
