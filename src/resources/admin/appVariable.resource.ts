export const formatAppVariable = (v: any) => ({
  id: v.id,
  name: v.name,
  value: v.value,
  created_at: v.created_at,
});

export const formatAppVariableList = (list: any[]) => list.map(formatAppVariable);
