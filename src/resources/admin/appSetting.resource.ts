export const formatAppSetting = (s: any) => ({
  id: s.id,
  app_label: s.app_label,
  app_type: s.app_type,
  app_version: s.app_version,
  force_updates: s.force_updates,
  maintenance_mode: s.maintenance_mode,
  created_at: s.created_at,
});

export const formatAppSettingsList = (items: any[]) => items.map(formatAppSetting);
