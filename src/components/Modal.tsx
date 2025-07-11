"use client";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  trigger?: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  showCloseButton?: boolean;
  closeButtonText?: string;
  confirmBtnText?: string;
  confirmBtnClassName?: string;
  isLoading?: boolean;
  onConfirm?: VoidFunction;
  confirmBtnVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
}

export default function Modal({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  className,
  showCloseButton = true,
  closeButtonText = "Cancel",
  confirmBtnText = "Confirm",
  confirmBtnClassName,
  isLoading = false,
  onConfirm,
  confirmBtnVariant,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn("sm:max-w-[425px]", className)}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="grid gap-4">{children}</div>
        <DialogFooter>
          {showCloseButton && (
            <DialogClose asChild>
              <Button variant="outline">{closeButtonText}</Button>
            </DialogClose>
          )}
          <Button
            className={confirmBtnClassName}
            disabled={isLoading}
            onClick={onConfirm}
            variant={confirmBtnVariant}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmBtnText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
