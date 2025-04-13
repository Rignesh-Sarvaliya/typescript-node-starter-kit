export const formatInitAppResponse = (data: any) => {
  return {
    app_type: data.app_type,
    app_version: data.app_version,
    force_updates: !!data.force_updates,
    maintenance_mode: !!data.maintenance_mode,
    label: data.app_label,
  };
};
