'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  Eye,
  Tag,
  Download,
  Calendar,
  User,
  X,
  UploadCloud,
} from 'lucide-react';
import { GalleryCategory, ProjectPhoto } from '@/types';

export default function GalleryPage() {
  const { photos, projects, addPhoto, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [visibilityFilter, setVisibilityFilter] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectPhoto | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New photo form state
  const [newPhoto, setNewPhoto] = useState({
    projectId: projects[0]?.id || '',
    category: 'Installation' as GalleryCategory,
    caption: '',
    tags: 'Joinery, Bespoke, Luxury',
    visibility: 'Portfolio / Public' as const,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  });

  const filteredPhotos = photos.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.caption.toLowerCase().includes(q) ||
      p.projectName.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesVis = visibilityFilter === 'All' || p.visibility === visibilityFilter;
    return matchesSearch && matchesCat && matchesVis;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.caption) return;
    const proj = projects.find((p) => p.id === newPhoto.projectId) || projects[0];
    addPhoto({
      projectId: proj.id,
      projectName: proj.name,
      category: newPhoto.category,
      caption: newPhoto.caption,
      tags: newPhoto.tags.split(',').map((t) => t.trim()),
      visibility: newPhoto.visibility,
      imageUrl: newPhoto.imageUrl,
    });
    setIsUploadModalOpen(false);
    setNewPhoto({
      projectId: projects[0]?.id || '',
      category: 'Installation',
      caption: '',
      tags: 'Joinery, Bespoke, Luxury',
      visibility: 'Portfolio / Public',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            VISUAL CRAFTSMANSHIP & PORTFOLIO
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Project Gallery & Visual Archive
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Stage-by-stage visual history: bare-shell surveys, 3D designs, workshop joinery fabrication, delivery, on-site fit-out, and final portfolio marketing photography.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Images
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search project, tags (banquette, oak, brass, reception)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4268e8] text-[#17243b]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Before">Before Site</option>
            <option value="Design">Design / 3D Render</option>
            <option value="Manufacturing">Manufacturing / Shop</option>
            <option value="Delivery">Delivery / Logistics</option>
            <option value="Installation">Installation / Fit-Out</option>
            <option value="Final">Final Handover</option>
          </select>

          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
          >
            <option value="All">All Visibility</option>
            <option value="Portfolio / Public">Portfolio / Public</option>
            <option value="Internal">Internal Technical</option>
          </select>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden group cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative h-52 bg-slate-200 overflow-hidden">
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="blue">{photo.category}</Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant={photo.visibility === 'Portfolio / Public' ? 'green' : 'gray'}>
                  {photo.visibility}
                </Badge>
              </div>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-[#4268e8] uppercase tracking-wider block">
                  {photo.projectName}
                </span>
                <h3 className="font-bold text-xs text-[#17243b] mt-1 leading-snug line-clamp-2">
                  {photo.caption}
                </h3>
              </div>

              <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] text-[#7b8798]">
                <span>{photo.uploadedBy}</span>
                <span>{photo.uploadedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] bg-slate-900 overflow-hidden flex items-center justify-center">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption}
                className="max-h-[70vh] w-auto object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="blue">{selectedPhoto.category}</Badge>
                  <Badge variant="gray">{selectedPhoto.visibility}</Badge>
                  <span className="text-xs font-bold text-[#4268e8]">
                    {selectedPhoto.projectName}
                  </span>
                </div>
                <span className="text-xs text-[#7b8798]">Uploaded {selectedPhoto.uploadedAt}</span>
              </div>
              <h2 className="text-sm md:text-base font-extrabold text-[#17243b]">
                {selectedPhoto.caption}
              </h2>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {selectedPhoto.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-semibold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Images Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Project Photography"
        subtitle="Archive photographic evidence for quality control and marketing portfolio"
        maxWidth="md"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Target Project</label>
            <select
              value={newPhoto.projectId}
              onChange={(e) => setNewPhoto({ ...newPhoto, projectId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Stage Category</label>
              <select
                value={newPhoto.category}
                onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Before">Before Site</option>
                <option value="Design">Design / 3D Render</option>
                <option value="Manufacturing">Manufacturing / Shop</option>
                <option value="Delivery">Delivery</option>
                <option value="Installation">Installation</option>
                <option value="Final">Final Handover</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Visibility Scope</label>
              <select
                value={newPhoto.visibility}
                onChange={(e) => setNewPhoto({ ...newPhoto, visibility: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option value="Portfolio / Public">Portfolio / Public Marketing</option>
                <option value="Internal">Internal Operational / QC Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Caption / Description *</label>
            <input
              required
              type="text"
              placeholder="e.g. Completed fluted booth banquette seating in Forest Green velvet"
              value={newPhoto.caption}
              onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          {/* Simulated File Drop */}
          <div className="p-6 border-2 border-dashed border-[#cbd5e1] rounded-2xl bg-[#f8fafc] text-center hover:bg-[#edf1ff]/30 transition-colors cursor-pointer">
            <UploadCloud className="w-10 h-10 text-[#4268e8] mx-auto mb-2" />
            <div className="text-xs font-bold text-[#17243b]">Upload photo files or high-res JPG/PNG</div>
            <div className="text-[11px] text-[#7b8798] mt-1">Automatic EXIF timestamp and GPS extraction</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Search Tags (Comma separated)</label>
            <input
              type="text"
              placeholder="Banquette, Velvet, Soho, Brass, Dining"
              value={newPhoto.tags}
              onChange={(e) => setNewPhoto({ ...newPhoto, tags: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Photo to Gallery
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

