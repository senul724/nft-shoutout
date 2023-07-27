import { UploadResult } from "src/types/storage";

const errorList = {
  "sww": "something went wrong! try again later",
  "tal": "try again later",
  "highGas": "High network traffic! try again later",
  "iue": "Failed to upload the image !",
  "ua": "You are not authorized to perform this action",
  "inappropriate": "The image contains inappropriate content",
};

export type AvailableErrors = "sww" | "tal" | "highGas" | "iue" | "ua" | "inappropriate";

export function getErrorMsg(errorKey: AvailableErrors) {
  return errorList[errorKey];
}


export const uploadErrMap = new Map<UploadResult, string>();

uploadErrMap.set("bad_request", getErrorMsg("sww"))
uploadErrMap.set("unauthorized", getErrorMsg("ua"))
uploadErrMap.set("racy_content", getErrorMsg("inappropriate"))
uploadErrMap.set("adult_content", getErrorMsg("inappropriate"))
uploadErrMap.set("spoof_content", getErrorMsg("inappropriate"))
uploadErrMap.set("medical_content", getErrorMsg("inappropriate"))
uploadErrMap.set("violence_content", getErrorMsg("inappropriate"))
uploadErrMap.set("internal_server_error", getErrorMsg("sww"))
uploadErrMap.set("access_token_not_provided", getErrorMsg("sww"))
