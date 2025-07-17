import { findAppSettingByType } from "@/repositories/appSetting.repository";

export const getAppSettingByType = async (appType: string) => {
  return findAppSettingByType(appType);
};
