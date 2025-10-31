import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";

export default function AlertDialog({
  title,
  description,
  onConfirm,
  trigger,
  confirmButtonText,
  confirmButtonIcon,
  confirmButtonVariant,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  trigger: React.ReactNode;
  confirmButtonText: string;
  confirmButtonIcon: React.ReactNode;
  confirmButtonVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={confirmButtonVariant} onClick={onConfirm}>
              {confirmButtonText}
              {confirmButtonIcon}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
