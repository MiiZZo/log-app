export interface Log {
  level: "EVENT" | "ERROR";
  userId: string;
  message: string;
}
