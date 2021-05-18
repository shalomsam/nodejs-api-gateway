import { ApiError } from "@node-api-gateway/api-interfaces";
import toast from "react-hot-toast";

export const showError = (err: ApiError) => toast.error(err.message);