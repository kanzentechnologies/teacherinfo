export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  created_at?: string;
}

export const getFiles = async (): Promise<FileItem[]> => {
  try {
    const res = await fetch('/api/files');
    if (!res.ok) {
      console.error('Failed to fetch files');
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error('Error fetching files:', err);
    return [];
  }
};
