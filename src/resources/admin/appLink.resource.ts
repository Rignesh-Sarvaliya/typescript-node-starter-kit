export const formatAppLink = (link: any) => ({
  id: link.id,
  name: link.name,
  show_name: link.show_name,
  for: link.for,
  type: link.type,
  value: link.value,
  created_at: link.created_at,
});

export const formatAppLinksList = (links: any[]) => links.map(formatAppLink);
