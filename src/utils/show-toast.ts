import { ExternalToast, toast } from "sonner";
import { COLORS } from "./colors";

type Variant = "success" | "error" | "info" | "warning";

const styleMap: Record<Variant, object> = {
  success: { backgroundColor: COLORS.success },
  error: { backgroundColor: COLORS.error },
  info: { backgroundColor: COLORS.info },
  warning: { backgroundColor: COLORS.warning },
};

export function showToast(
  message: string,
  data?: ExternalToast,
  variant: Variant = "info"
) {
  const styleWithVariant = styleMap[variant];

  return toast(message, {
    ...data,
    style: {
      ...data?.style,
      ...styleWithVariant,
    },
  });
}
