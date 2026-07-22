import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export interface FieldLabelProps {
  children: ReactNode;
}

export default function FieldLabel({ children }: FieldLabelProps) {
  return (
    <Typography
      component="span"
      color="text.secondary"
      sx={{ fontSize: "0.9rem", fontWeight: 600 }}
    >
      {children}
    </Typography>
  );
}
