'use client';

import React, { useState } from 'react';
import { ExternalLink, Folder, ChevronDown, ChevronRight, FileText } from 'lucide-react';

export function LinksTableViewer({ links }: { links: any[] }) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedFolders(newExpanded);
  };

  const countLinks = (folder: any): number => {
    if (!folder.children) return 0;
    return folder.children.reduce((acc: number, child: any) => {
      if (child.type === 'folder') return acc + countLinks(child);
      return acc + 1;
    }, 0);
  };

  const getAllFolderIds = (items: any[]): string[] => {
    let ids: string[] = [];
    items.forEach(item => {
      if (item.type === 'folder') {
        ids.push(item.id);
        if (item.children) {
          ids = ids.concat(getAllFolderIds(item.children));
        }
      }
    });
    return ids;
  };

  const handleExpandAll = () => {
    setExpandedFolders(new Set(getAllFolderIds(links)));
  };

  const handleCollapseAll = () => {
    setExpandedFolders(new Set());
  };

  const renderTree = (items: any[], depth: number = 0) => {
    const result: React.ReactNode[] = [];
    
    // Sort items alphabetically
    const sortedItems = [...items].sort((a, b) => a.title.localeCompare(b.title));
    
    const folders = sortedItems.filter(i => i.type === 'folder');
    const files = sortedItems.filter(i => i.type !== 'folder');
    
    folders.forEach(folder => {
      const isExpanded = expandedFolders.has(folder.id);
      const count = countLinks(folder);
      
      result.push(
        <tr key={folder.id} className="bg-gray-50 hover:bg-gray-100 border-b border-border-main transition-colors">
          <td className="p-3 border-r border-border-main" colSpan={2} style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}>
            <div className="cursor-pointer flex items-center gap-2 text-primary font-bold" onClick={() => toggleFolder(folder.id)}>
              {isExpanded ? <ChevronDown size={18} className="text-gray-500" /> : <ChevronRight size={18} className="text-gray-500" />}
              <Folder size={18} className="text-blue-500" />
              <span className="truncate max-w-[200px] sm:max-w-md">{folder.title}</span>
              <span className="text-text-muted font-normal text-xs ml-2">({count} item{count !== 1 ? 's' : ''})</span>
            </div>
          </td>
        </tr>
      );
      
      if (isExpanded && folder.children && folder.children.length > 0) {
        result.push(...renderTree(folder.children, depth + 1));
      } else if (isExpanded) {
        result.push(
          <tr key={`${folder.id}-empty`} className="border-b border-border-main">
            <td colSpan={2} className="p-3 text-center text-sm text-text-muted italic" style={{ paddingLeft: `${(depth + 1) * 1.5 + 0.75}rem` }}>
              Empty folder
            </td>
          </tr>
        );
      }
    });

    files.forEach((link, idx) => {
      result.push(
        <tr key={link.id} className="border-b border-border-main hover:bg-blue-50/50 transition-colors group">
          <td className="p-3 border-r border-border-main text-center text-gray-400 w-12">
            <FileText size={16} className="mx-auto" />
          </td>
          <td className="p-3 border-r border-border-main" style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary font-bold text-lg hover:text-secondary hover:underline break-words group-hover:text-secondary inline-flex items-center gap-2">
              {link.title} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            {link.description && (
              <p className="text-sm text-text-muted mt-1 leading-relaxed">{link.description}</p>
            )}
          </td>
        </tr>
      );
    });

    return result;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end gap-3">
        <button onClick={handleExpandAll} className="text-sm font-bold text-primary hover:text-secondary underline decoration-primary/30 underline-offset-2">Expand All</button>
        <button onClick={handleCollapseAll} className="text-sm font-bold text-primary hover:text-secondary underline decoration-primary/30 underline-offset-2">Collapse All</button>
      </div>
      <div className="overflow-x-auto shadow-sm">
        <table className="w-full border-collapse border border-border-main text-left bg-white">
          <thead>
            <tr className="bg-gray-100 text-primary border-b border-border-main">
              <th className="p-3 border-r border-border-main w-12 text-center text-sm uppercase tracking-wide">Type</th>
              <th className="p-3 border-r border-border-main text-sm uppercase tracking-wide">Title & Description</th>
            </tr>
          </thead>
          <tbody>
            {renderTree(links)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
