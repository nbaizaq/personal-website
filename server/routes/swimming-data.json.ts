import { buildSwimmingData } from "~/utils/swimming/build-data";
import { defineEventHandler } from "h3";

export default defineEventHandler(() => {
  return buildSwimmingData();
});
