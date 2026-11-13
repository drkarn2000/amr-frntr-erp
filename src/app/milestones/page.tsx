'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  Clock,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Layers,
  ArrowRight,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Milestone, TaskItem } from '@/types';

export default function MilestonesPage() {
  const {
    milestones,
    tasks,
    projects,
    addMilestone,
    addTask,
    toggleMilestoneStatus,
    toggleTaskStatus,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // New Milestone Form
  const [newMs, setNewMs] = useState({
    projectId: projects[0]?.id || '',
    title: '',
    owner: 'James Wilson',
    dueDate: '',
    dependency: '',
    notes: '',
  });

  // New Task Form
  const [newTask, setNewTask] = useState({
    projectId: projects[0]?.id || '',
    title: '',
    owner: 'James Wilson',
    dueDate: '',
    priority: 'Normal' as const,
  });

  // Metrics
  const completedCount = milestones.filter((m) => m.status === 'Completed').length;
  const overdueCount = milestones.filter(
    (m) => m.status === 'Overdue' || (m.status !== 'Completed' && new Date(m.dueDate) < new Date())
  ).length;
  const inProgressCount = milestones.filter((m) => m.status === 'In progress').length;
  const openTasksCount = tasks.filter((t) => t.status !== 'Done').length;

  const filteredMilestones = milestones.filter((m) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      m.title.toLowerCase().includes(q) ||
      m.projectName.toLowerCase().includes(q) ||
      m.owner.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMs.title) return;
    const proj = projects.find((p) => p.id === newMs.projectId) || projects[0];
    addMilestone({
      projectId: proj.id,
      projectName: proj.name,
      title: newMs.title,
      owner: newMs.owner,
      dueDate: newMs.dueDate || new Date().toISOString().split('T')[0],
      dependency: newMs.dependency,
      notes: newMs.notes,
    });
    setIsMilestoneModalOpen(false);
    setNewMs({
      projectId: projects[0]?.id || '',
      title: '',
      owner: 'James Wilson',
      dueDate: '',
      dependency: '',
      notes: '',
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const proj = projects.find((p) => p.id === newTask.projectId) || projects[0];
    addTask({
      projectId: proj.id,
      title: newTask.title,
      owner: newTask.owner,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      priority: newTask.priority,
    });
    setIsTaskModalOpen(false);
    setNewTask({
      projectId: projects[0]?.id || '',
      title: '',
      owner: 'James Wilson',
      dueDate: '',
      priority: 'Normal',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="text-[11px] font-extrabold tracking-widest text-[#4268e8] uppercase">
            DELIVERY TIMELINES & SCHEDULES
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#17243b] tracking-tight mt-1">
            Milestones & Tasks
          </h1>
          <p className="text-xs md:text-sm text-[#7b8798] mt-1">
            Gantt-ready project milestones, task ownership, critical dependencies, and on-site fit-out action items.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            icon={<Plus className="w-4 h-4 text-[#4268e8]" />}
            onClick={() => setIsTaskModalOpen(true)}
          >
            Add Task
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsMilestoneModalOpen(true)}
          >
            Add Milestone
          </Button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="In Progress"
          value={inProgressCount}
          trend="Active site stages"
          trendType="neutral"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          label="Overdue Milestones"
          value={overdueCount.toString().padStart(2, '0')}
          trend="Require immediate reschedule"
          trendType="negative"
          icon={<AlertCircle className="w-5 h-5" />}
        />
        <StatCard
          label="Completed Milestones"
          value={completedCount.toString().padStart(2, '0')}
          trend="Verified deliverables"
          trendType="positive"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          label="Open Site Tasks"
          value={openTasksCount.toString().padStart(2, '0')}
          trend="Pending fitter completion"
          trendType="warning"
          icon={<CheckSquare className="w-5 h-5" />}
        />
      </div>

      {/* Lifecycle Recommendation Strip */}
      <div className="p-4 bg-white rounded-2xl border border-[#e8edf3] shadow-xs text-xs text-[#334155] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#17243b]">Standard Lifecycle:</span>
          <span className="text-[#64748b] hidden md:inline">
            Brief → Survey → Drawing → Quotation → Approval → Deposit → Materials Ordered → Production → Delivery → Installation → Snagging → Handover.
          </span>
        </div>
        <Badge variant="blue">12 Controlled Stages</Badge>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e8edf3] shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7b8798] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search milestone title, project or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4268e8] text-[#17243b]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-[#e2e8f0] rounded-xl text-[#334155] focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="In progress">In Progress</option>
          <option value="Waiting">Waiting Dependency</option>
          <option value="Not started">Not Started</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Main Grid: Milestones Table & Task Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Master Milestones Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
            <h2 className="text-sm md:text-base font-bold text-[#17243b]">Project Milestones</h2>
            <Badge variant="gray">{filteredMilestones.length} Recorded</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e8edf3] bg-[#f8fafc] text-[10px] font-bold text-[#8792a1] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Milestone Title</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Owner</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Progress</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredMilestones.map((ms) => (
                  <tr key={ms.id} className="hover:bg-[#f8fafc]">
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-[#17243b] text-xs">{ms.title}</div>
                      {ms.dependency && (
                        <div className="text-[10px] text-[#7b8798] mt-0.5">
                          Dep: {ms.dependency}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 font-bold text-[#17243b]">{ms.projectName}</td>

                    <td className="py-4 px-4 text-[#475569]">{ms.owner}</td>

                    <td className="py-4 px-4 text-[#7b8798]">{ms.dueDate}</td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#4268e8] h-full rounded-full"
                            style={{ width: `${ms.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#7b8798]">{ms.progressPercent}%</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <Badge
                        variant={
                          ms.status === 'Completed'
                            ? 'green'
                            : ms.status === 'Overdue'
                            ? 'red'
                            : ms.status === 'Waiting'
                            ? 'amber'
                            : 'blue'
                        }
                      >
                        {ms.status}
                      </Badge>
                    </td>

                    <td className="py-4 pr-6 text-right">
                      <Button
                        variant={ms.status === 'Completed' ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => toggleMilestoneStatus(ms.id)}
                      >
                        {ms.status === 'Completed' ? 'Undo' : 'Complete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Site Tasks Checklist */}
        <div className="bg-white rounded-2xl border border-[#e8edf3] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-4.5 border-b border-[#e8edf3] flex items-center justify-between">
            <h2 className="text-sm md:text-base font-bold text-[#17243b]">Site Action Items</h2>
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsTaskModalOpen(true)}
            >
              Add Task
            </Button>
          </div>

          <div className="p-6 flex-1 space-y-3 overflow-y-auto max-h-[500px]">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task.id)}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  task.status === 'Done'
                    ? 'bg-[#f8fafc] border-[#e2e8f0] opacity-60'
                    : 'bg-white border-[#cbd5e1] hover:border-[#4268e8]'
                }`}
              >
                <div className="mt-0.5 text-[#4268e8]">
                  {task.status === 'Done' ? (
                    <CheckSquare className="w-4 h-4 text-[#16845f]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#94a3b8]" />
                  )}
                </div>
                <div className="flex-1 text-xs">
                  <div
                    className={`font-bold text-[#17243b] ${
                      task.status === 'Done' ? 'line-through text-[#94a3b8]' : ''
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="text-[11px] text-[#7b8798] mt-1 flex items-center justify-between">
                    <span>Assigned: {task.owner}</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#e8edf3] bg-[#f8fafc] text-[11px] text-[#7b8798]">
            Click any task checkbox to immediately toggle between To Do, In Progress, and Done.
          </div>
        </div>
      </div>

      {/* Add Milestone Modal */}
      <Modal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        title="Schedule Project Milestone"
        subtitle="Set delivery dates, dependencies, and responsible operational lead"
        maxWidth="md"
      >
        <form onSubmit={handleCreateMilestone} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Target Project</label>
            <select
              value={newMs.projectId}
              onChange={(e) => setNewMs({ ...newMs, projectId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Milestone Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. On-Site Night-time Installation"
              value={newMs.title}
              onChange={(e) => setNewMs({ ...newMs, title: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Owner / Lead</label>
              <select
                value={newMs.owner}
                onChange={(e) => setNewMs({ ...newMs, owner: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              >
                <option>James Wilson (Installer / Site Lead)</option>
                <option>Sarah Mitchell (UK PM)</option>
                <option>Arjun Mehta (India Coordinator)</option>
                <option>Workshop / Production</option>
                <option>Procurement Desk</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Target Due Date</label>
              <input
                type="date"
                value={newMs.dueDate}
                onChange={(e) => setNewMs({ ...newMs, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Preceding Dependency</label>
            <input
              type="text"
              placeholder="e.g. Workshop Manufacturing or Drawing Signoff"
              value={newMs.dependency}
              onChange={(e) => setNewMs({ ...newMs, dependency: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsMilestoneModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Schedule Milestone
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Assign Site Action Task"
        subtitle="Individual work item for installation crew or project manager"
        maxWidth="md"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Target Project</label>
            <select
              value={newTask.projectId}
              onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Task Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Fit brass kickplates and connect LED wiring"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Assigned Person</label>
              <input
                type="text"
                value={newTask.owner}
                onChange={(e) => setNewTask({ ...newTask, owner: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
            <Button variant="secondary" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Assign Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

